<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      padding: 2rem 1rem;
      color: #333;
      background: #fafaf8;
      line-height: 1.6;
    }
    .banner {
      background: #f0ede6;
      border: 1px solid #ddd8cc;
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
      font-size: 0.875rem;
      color: #666;
    }
    .banner strong { color: #333; }
    .banner a { color: #2d6a4f; }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .description {
      color: #666;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }
    .item {
      border-bottom: 1px solid #e8e4dc;
      padding: 1rem 0;
    }
    .item:last-child { border-bottom: none; }
    .item-title {
      font-size: 1.05rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .item-title a {
      color: #1a1a1a;
      text-decoration: none;
    }
    .item-title a:hover {
      color: #2d6a4f;
    }
    .item-date {
      font-size: 0.8rem;
      color: #999;
      margin-bottom: 0.4rem;
    }
    .item-desc {
      font-size: 0.9rem;
      color: #555;
    }
    .categories {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin-top: 0.4rem;
    }
    .category {
      font-size: 0.7rem;
      background: #e8e4dc;
      color: #666;
      padding: 0.1rem 0.5rem;
      border-radius: 1rem;
    }
  </style>
</head>
<body>
  <div class="banner">
    <strong>This is an RSS feed.</strong> Copy the URL into your feed reader to subscribe.
    An <a href="/atom.xml">Atom feed</a> is also available.
  </div>
  <h1><xsl:value-of select="/rss/channel/title"/></h1>
  <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
  <xsl:for-each select="/rss/channel/item">
    <div class="item">
      <div class="item-title">
        <a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
          <xsl:value-of select="title"/>
        </a>
      </div>
      <div class="item-date"><xsl:value-of select="pubDate"/></div>
      <xsl:if test="description">
        <div class="item-desc"><xsl:value-of select="description"/></div>
      </xsl:if>
      <xsl:if test="category">
        <div class="categories">
          <xsl:for-each select="category">
            <span class="category"><xsl:value-of select="."/></span>
          </xsl:for-each>
        </div>
      </xsl:if>
    </div>
  </xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
