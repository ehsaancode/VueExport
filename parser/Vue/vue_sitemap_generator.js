const fs = require('fs');
const path = require('path');

// XML builder function
function buildXMLSitemap(hostname, urls) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urls.forEach(entry => {
        const fullUrl = new URL(entry.url, hostname).href;
        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
        if (entry.lastmod) xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
        // if (entry.changefreq) xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
        // if (entry.priority !== undefined) xml += `    <priority>${entry.priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
}

// Helper to escape XML special chars
function escapeXml(str) {
    return str.replace(/[<>&'"]/g, (match) => {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
        }
    });
}

/**
 * Generates sitemap.xml
 * @param {string} outputDir - The directory to save the sitemap.xml
 * @param {string} hostname - The base hostname
 * @param {Array} urls - Array of objects { url, lastmod, changefreq, priority }
 * @returns {Promise<string>} - Resolves with the output path
 */
function generateSitemap(outputDir, hostname, urls) {
    return new Promise((resolve, reject) => {
        try {
            const xml = buildXMLSitemap(hostname, urls);
            const outputPath = path.join(outputDir, 'sitemap.xml');
            fs.writeFileSync(outputPath, xml, 'utf8');
            console.log(`Sitemap generated: ${outputPath}`);
            resolve(outputPath);
        } catch (err) {
            console.error('Error generating sitemap:', err);
            reject(err);
        }
    });
}

module.exports = { generateSitemap };
