// healthcheck.js - Updated version

console.log('🏥 Health check starting...');

async function runHealthCheck() {
    const statusDiv = document.getElementById('health-status');
    if (!statusDiv) return;
    
    statusDiv.innerHTML = '<p>🔄 Checking services...</p>';
    
    const config = window.ZENSICAL_CONFIG || window.VERIFIER_CONFIG || {};
    const proxyUrl = config.vc_proxy_url || 'https://proxy-cors-azure.vercel.app/api/proxy';
    const proxyBase = proxyUrl.replace('/api/proxy', ''); // Get base URL
    
    try {
        // Call the new health endpoint
        const healthResp = await fetch(proxyBase + '/api/health', {
            method: 'GET',
            cache: 'no-cache'
        });
        
        if (!healthResp.ok) {
            throw new Error('Health check failed');
        }
        
        const health = await healthResp.json();
        
        // Parse results
        const results = [
            { 
                name: 'CORS Proxy (Vercel)', 
                status: health.services.proxy === 'up' ? 'up' : 'down', 
                message: health.services.proxy === 'up' ? '✅ UP' : '❌ Down' 
            },
            { 
                name: 'Issuer Service (via Tunnel)', 
                status: health.services.issuer === 'UP' ? 'up' : 'down', 
                message: health.services.issuer === 'UP' ? '✅ UP' : `❌ ${health.services.issuer}` 
            },
            { 
                name: 'Verifier Service (via Tunnel)', 
                status: health.services.verifier === 'UP' ? 'up' : 'down', 
                message: health.services.verifier === 'UP' ? '✅ UP' : `❌ ${health.services.verifier}` 
            }
        ];
        
        // Display results (existing code)
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
        statusDiv.innerHTML = '<p>❌ Health check failed</p>';
    }
}

setTimeout(runHealthCheck, 2000);
console.log('✅ Health check loaded');
