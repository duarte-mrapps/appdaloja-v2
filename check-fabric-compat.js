import fs from 'fs'
import path from 'path'

const nodeModules = path.resolve('node_modules')
const outputMd = path.resolve('fabric-compat-report.md')
const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const deps = {
  ...pkgJson.dependencies,
  ...pkgJson.devDependencies
}

const checkFabricCompatibility = pkgName => {
  const pkgPath = path.join(nodeModules, pkgName, 'package.json')
  if (!fs.existsSync(pkgPath)) return { pkgName, compatible: false, reason: 'sem package.json' }

  const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const pkgDir = path.dirname(pkgPath)

  const rnPeer = pkgData.peerDependencies?.['react-native'] || ''
  const versionNotOk = rnPeer && /0\.[0-6][0-9]/.test(rnPeer)
  if (versionNotOk) return { pkgName, compatible: false, reason: 'peer react-native antigo' }

  if (pkgData.codegenConfig) return { pkgName, compatible: true, reason: 'usa codegenConfig (ok)' }

  const androidPath = path.join(pkgDir, 'android')
  const iosPath = path.join(pkgDir, 'ios')
  const hasNative = fs.existsSync(androidPath) || fs.existsSync(iosPath)

  if (!hasNative)
    return { pkgName, compatible: true, reason: 'JS only (sem código nativo)' }

  let reason = null
  const checkFiles = dir => {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) checkFiles(filePath)
      else if (/\.(java|m|mm|swift|kt|js|ts)$/.test(file)) {
        const content = fs.readFileSync(filePath, 'utf8')
        if (content.includes('UIManager.getViewManagerConfig')) reason = 'usa UIManager obsoleto'
        if (content.includes('requireNativeComponent(')) reason = 'usa requireNativeComponent sem Fabric'
      }
    }
  }

  checkFiles(androidPath)
  checkFiles(iosPath)

  return {
    pkgName,
    compatible: !reason,
    reason: reason || 'nenhum problema detectado'
  }
}

const results = Object.keys(deps).map(checkFabricCompatibility)
const compatible = results.filter(r => r.compatible)
const incompatible = results.filter(r => !r.compatible)

// gera tabela markdown
const makeTable = (title, data) => {
  if (!data.length) return `### ${title}\n\n*(nenhum encontrado)*\n`
  let md = `### ${title}\n\n| Pacote | Status |\n|--------|--------|\n`
  for (const item of data) {
    md += `| ${item.pkgName} | ${item.reason} |\n`
  }
  md += '\n'
  return md
}

const markdown =
`# 🧩 Relatório de Compatibilidade com Fabric (React Native)

> Gerado automaticamente em ${new Date().toLocaleString('pt-BR')}

${makeTable('✅ Pacotes Compatíveis', compatible)}
${makeTable('⚠️ Pacotes Potencialmente Incompatíveis', incompatible)}
`

fs.writeFileSync(outputMd, markdown)
console.log(`📄 Relatório gerado: ${path.basename(outputMd)}\n`)
