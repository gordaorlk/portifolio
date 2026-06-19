// --- Gerador de QR Code com Sobreposição de Logotipo ---
// Autor: Hubert
// Descrição: Script que renderiza códigos QR robustos contendo logotipos personalizados no centro.

const qrCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

async function gerarQRCodeComLogo(urlDestino, caminhoLogo, caminhoSalvar) {
  try {
    console.log("⚡ Gerando matriz do QR Code...");
    const canvas = createCanvas(300, 300);
    
    // Renderiza o QR Code no Canvas em alta fidelidade
    await qrCode.toCanvas(canvas, urlDestino, {
      errorCorrectionLevel: 'H', // Alta tolerância para permitir cobrir o centro com logo
      margin: 1,
      color: {
        dark: '#240b36',  // Tom de roxo escuro premium
        light: '#ffffff'
      }
    });

    const ctx = canvas.getContext('2d');
    const logoSize = 60;
    const x = (canvas.width - logoSize) / 2;
    const y = (canvas.height - logoSize) / 2;
    
    console.log("🎨 Fundindo logotipo no centro do QR code...");
    const logo = await loadImage(caminhoLogo);
    
    // Adiciona uma moldura circular de fundo branco sob o logo para excelente legibilidade e contraste
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, (logoSize / 2) + 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenha o logotipo centralizado
    ctx.drawImage(logo, x, y, logoSize, logoSize);
    
    const fs = require('fs');
    const out = fs.createWriteStream(caminhoSalvar);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log(`🎉 QR Code Customizado gerado com sucesso em: ${caminhoSalvar}`));
    
  } catch (erro) {
    console.error("❌ Falha inesperada durante o processamento de imagem:", erro);
  }
}
