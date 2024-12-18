// index.js
const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

app.use(express.static('public'));

app.get('/api/data/:symbol', async (req, res) => {
    try {
        const data = await analyzeSymbol(req.params.symbol);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function analyzeSymbol(symbol) {
    const url = `https://api.binance.com/api/v3/klines`;
    
    const response = await axios.get(url, {
        params: {
            symbol: symbol.toUpperCase(),
            interval: '1d',
            limit: 1000
        }
    });

    // Xử lý dữ liệu candlestick cơ bản
    const data = response.data.map(candle => ({
        time: candle[0] / 1000,
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5])
    }));

    // Đảo ngược mảng để có dữ liệu mới nhất ở đầu
    data.reverse();

    // Tính toán delta
    const processedData = [];
    for (let i = 0; i < data.length - 7; i++) {
        const current = data[i];            // Ngày hiện tại
        const prev = data[i + 7];           // Ngày 7 ngày trước

        const deltaPrice = current.close - prev.close;
        const deltaVol = (current.volume / prev.volume * 100) - 100;

        processedData.push({
            time: current.time,
            deltaPrice: deltaPrice,
            deltaVolume: deltaVol,
            close: current.close,
            volume: current.volume,
            // Thêm thông tin debug
            currentDate: new Date(current.time * 1000).toLocaleDateString(),
            prevDate: new Date(prev.time * 1000).toLocaleDateString()
        });
    }

    // Đảo ngược lại để hiển thị đúng trên biểu đồ
    data.reverse();
    processedData.reverse();

    // Tính toán thống kê
    const deltaPrices = processedData.map(d => d.deltaPrice).sort((a, b) => a - b);
    const peak = deltaPrices[Math.floor(deltaPrices.length * 0.99)];
    const bottom = deltaPrices[Math.floor(deltaPrices.length * 0.01)];

    // Log thông tin debug
    console.log("Latest processed dates:");
    console.log(processedData.slice(-5).map(d => ({
        date: new Date(d.time * 1000).toLocaleDateString(),
        deltaPrice: d.deltaPrice.toFixed(2),
        deltaVolume: d.deltaVolume.toFixed(2)
    })));

    return {
        candleData: data,
        deltaData: processedData,
        stats: {
            peak,
            bottom,
            probabilityAbovePeak: deltaPrices.filter(p => p > peak).length / deltaPrices.length,
            probabilityBelowBottom: deltaPrices.filter(p => p < bottom).length / deltaPrices.length
        }
    };
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});