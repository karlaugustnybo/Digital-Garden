<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title><xsl:value-of select="/atom:feed/atom:title"/> — Atom Feed</title>
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
    .subtitle {
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
    <strong>This is an Atom feed.</strong> Copy the URL into your feed reader to subscribe.
    An <a href="/rss.xml">RSS feed</a> is also available.
  </div>
  <h1><xsl:value-of select="/atom:feed/atom:title"/></h1>
  <p class="subtitle"><xsl:value-of select="/atom:feed/atom:subtitle"/></p>
  <xsl:for-each select="/atom:feed/atom:entry">
    <div class="item">
      <div class="item-title">
        <a><xsl:attribute name="href"><xsl:value-of select="atom:link/@href"/></xsl:attribute>
          <xsl:value-of select="atom:title"/>
        </a>
      </div>
      <div class="item-date"><xsl:value-of select="atom:updated"/></div>
      <xsl:if test="atom:summary">
        <div class="item-desc"><xsl:value-of select="atom:summary"/></div>
      </xsl:if>
      <xsl:if test="atom:category">
        <div class="categories">
          <xsl:for-each select="atom:category">
            <span class="category"><xsl:value-of select="@term"/></span>
          </xsl:for-each>
        </div>
      </xsl:if>
    </div>
  </xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
