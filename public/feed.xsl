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
    .banner-copy {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.2rem;
      margin-bottom: 0.15rem;
    }
    .banner strong { color: #333; }
    .banner a { color: #2d6a4f; }
    .copy-url {
      display: inline-block;
      box-sizing: border-box;
      height: 1.35rem;
      line-height: 1.35rem;
      padding: 0 0.7rem;
      margin: 0;
      background: none;
      border: 1px solid #e6e3e1;
      border-radius: 3rem;
      font-family: "Noto Sans", sans-serif;
      font-size: 0.78rem;
      font-weight: 400;
      text-align: center;
      color: inherit;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .copy-url:hover {
      color: oklch(33.613% 0.02347 39.176);
      border-color: oklch(33.613% 0.02347 39.176);
      box-shadow: 0.2px 0.2px 0.8px -10px rgba(40, 10, 0, 0.014),
        0.4px 0.4px 2px -10px rgba(40, 10, 0, 0.02),
        0.8px 0.8px 3.8px -10px rgba(40, 10, 0, 0.025),
        1.3px 1.3px 6.7px -10px rgba(40, 10, 0, 0.03),
        2.5px 2.5px 12.5px -10px rgba(40, 10, 0, 0.036),
        6px 6px 30px -10px rgba(40, 10, 0, 0.05);
    }
    .copy-url:focus-visible {
      outline: 2px solid oklch(33.613% 0.02347 39.176);
      outline-offset: 2px;
    }
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
    <div class="banner-copy">
      <strong>This is an RSS feed.</strong>
      <button type="button" class="copy-url" onclick="copyFeedUrl(this)">Copy the URL</button>
      <span>into your feed reader to subscribe.</span>
    </div>
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
  <script>
    function copyFeedUrl(button) {
      var url = window.location.href;

      function setButtonLabel(label) {
        button.textContent = label;
        window.setTimeout(function () {
          button.textContent = "Copy the URL";
        }, 1500);
      }

      if (navigator.clipboard &amp;&amp; navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(function () { setButtonLabel("Copied!"); })
          .catch(function () { setButtonLabel("Copy failed"); });
        return;
      }

      var textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        setButtonLabel("Copied!");
      } catch (error) {
        setButtonLabel("Copy failed");
      }

      document.body.removeChild(textarea);
    }
  </script>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
