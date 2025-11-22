// ============================================================================
// HEALTH CHECK - DETAILED VERSION
// ============================================================================
console.log('🏥 Health check starting...');

async function runHealthCheck() {
    const statusDiv = document.getElementById('health-status');
    if (!statusDiv) return;
    
    statusDiv.innerHTML = '<p>🔄 Checking services...</p>';
    
    const config = window.ZENSICAL_CONFIG || window.VERIFIER_CONFIG || {};
    const proxyUrl = config.vc_proxy_url || 'https://proxy-cors-azure.vercel.app/api/proxy';
    const issuerUrl = config.issuer_url || 'https://issuer.atarigo.net';
    const verifierUrl = config.verifier_url || 'https://verifier.atarigo.net';
    
    const results = [];
    
    try {
        // 1. Check proxy
        try {
            await fetch(proxyUrl, { method: 'OPTIONS', cache: 'no-cache' });
            results.push({ name: 'CORS Proxy (Vercel)', status: 'up', message: '✅ UP' });
        } catch (e) {
            results.push({ name: 'CORS Proxy (Vercel)', status: 'down', message: '❌ Down' });
        }
        
        // 2. Check issuer
        try {
            const issuerResp = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Target-URL': issuerUrl + '/actuator/health'
                },
                cache: 'no-cache'
            });
            
            if (issuerResp.ok) {
                const data = await issuerResp.json();
                const isHealthy = data.status === 'UP';
                results.push({ 
                    name: 'Issuer Service (via Tunnel)', 
                    status: isHealthy ? 'up' : 'down', 
                    message: isHealthy ? '✅ UP' : `⚠️ ${data.status}` 
                });
            } else {
                results.push({ 
                    name: 'Issuer Service (via Tunnel)', 
                    status: 'down', 
                    message: `❌ HTTP ${issuerResp.status}` 
                });
            }
        } catch (e) {
            results.push({ 
                name: 'Issuer Service (via Tunnel)', 
                status: 'down', 
                message: '❌ Unreachable' 
            });
        }
        
        // 3. Check verifier
        try {
            const verifierResp = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Target-URL': verifierUrl + '/actuator/health'
                },
                cache: 'no-cache'
            });
            
            if (verifierResp.ok) {
                const data = await verifierResp.json();
                const isHealthy = data.status === 'UP';
                results.push({ 
                    name: 'Verifier Service (via Tunnel)', 
                    status: isHealthy ? 'up' : 'down', 
                    message: isHealthy ? '✅ UP' : `⚠️ ${data.status}` 
                });
            } else {
                results.push({ 
                    name: 'Verifier Service (via Tunnel)', 
                    status: 'down', 
                    message: `❌ HTTP ${verifierResp.status}` 
                });
            }
        } catch (e) {
            results.push({ 
                name: 'Verifier Service (via Tunnel)', 
                status: 'down', 
                message: '❌ Unreachable' 
            });
        }
        
        // Display results
        const upCount = results.filter(r => r.status === 'up').length;
        const totalCount = results.length;
        const allUp = upCount === totalCount;
        
        const icon = allUp ? '✅' : upCount > 0 ? '⚠️' : '❌';
        const text = allUp ? 'All Systems Operational' : upCount > 0 ? `${upCount}/${totalCount} Services Up` : 'All Systems Down';
        
        let html = '<p><strong>' + icon + ' ' + text + '</strong></p>';
        html += '<ul style="margin-top:10px;">';
        results.forEach(r => {
            html += '<li><strong>' + r.name + '</strong>: ' + r.message + '</li>';
        });
        html += '</ul>';
        
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        html += '<p style="font-size:0.85em;opacity:0.7;margin-top:12px;margin-bottom:0;">';
        html += '<em>Last checked: ' + time + '</em></p>';
        
        statusDiv.innerHTML = html;
        
        // Update form border color
        const form = document.getElementById('vc-form');
        if (form) form.style.borderTopColor = allUp ? '#28a745' : '#ffc107';
        
        console.log('✅ Health checks complete', { upCount, totalCount, allUp });
        
    } catch (e) {
        console.error('❌ Health check error:', e);
        statusDiv.innerHTML = '<p>❌ Check failed</p>';
    }
}

setTimeout(runHealthCheck, 2000);
console.log('✅ Health check loaded');
