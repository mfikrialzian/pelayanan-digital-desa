export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const GAS_API_URL = process.env.GAS_API_URL;

    if (!GAS_API_URL) {
        console.error("GAS_API_URL environment variable is missing.");
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    try {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        });

        const textResult = await response.text();
        
        try {
            const jsonResult = JSON.parse(textResult);
            return res.status(200).json(jsonResult);
        } catch (e) {
            console.error("Failed to parse GAS response as JSON", textResult);
            // GAS sometimes returns non-JSON or HTML on error
            return res.status(502).json({ success: false, error: 'Invalid response from GAS backend', details: textResult });
        }
    } catch (error) {
        console.error("Error communicating with GAS:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
