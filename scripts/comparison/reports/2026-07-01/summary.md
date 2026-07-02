# Upstream Comparison Report — 2026-07-01

- Local HEAD:  4bc25be — feat: add local font workflow and update feed/OG rendering (2026-04-12)
- Upstream HEAD: 3be9dbb — Make growth stage label interactive (#227) (2026-06-19)
- Common commit base: None (histories are unrelated; comparison is content-based)

## File counts

| Branch | src files |
|--------|-----------|
| my-garden | 194 |
| maggie-upstream | 1579 |

## Source-only files

### Only in your garden

```
Only in /var/folders/vq/zz5zmfk13pg6hzq4y94xjdtr0000gn/T/tmp.YEIT44Zkss/my-garden/my-garden/src/assets
- components/cards/BlurImage.astro
- components/cards/MusicCard.astro
- components/cards/NotebookCard.astro
- components/cards/ResearchCard.astro
- components/cards/ShortfilmCard.astro
- components/mdx/Badge.astro
- components/mdx/KatexRenderer.astro
- components/mdx/Math.astro
- components/notebooks
Only in /var/folders/vq/zz5zmfk13pg6hzq4y94xjdtr0000gn/T/tmp.YEIT44Zkss/my-garden/my-garden/src/config
- content/disabled
- content/essays/Arguments-For-AI-Safety-Being-Important-1.mdx
- content/essays/Arguments-For-AI-Safety-Being-Important.mdx
- content/essays/Artificial-Intelligence-Impact-on-the-Individual-and-Legislation.mdx
- content/essays/draft-example-human-ai-collaboration.mdx
- content/music
- content/notebooks
- content/notes/draft-reinforcement-learning-notes.mdx
- content/now/2024-01.mdx
- content/research
- content/shortfilms
- content/smidgeons/2024-01-example-smidgeon.mdx
- content/smidgeons/2026-02-claude-opus-4-6-system-card-part-2-frontier-alignment.mdx
- images/essays
- pages/atom.xml.ts
- pages/music.astro
- pages/notebooks.astro
- pages/research
- pages/rss.xml.ts
- pages/shortfilms.astro
- pages/smidgeons-atom.xml.ts
- pages/smidgeons.xml.ts
- plugins/remark-wiki-link.ts
- scripts/build
- scripts/card-click.ts
- scripts/links.json
- scripts/utils
- utils/feedUtils.ts
- utils/slugifyTopic.ts
```

### Only upstream

```
- components/cards/PatternCard.astro
- components/cards/PodcastCard.astro
- components/cards/TalkCard.astro
- components/icons
- components/mdx/QuoteSource.astro
- components/mdx/ScrollyTalkSection.astro
- components/unique/ChatHistoryTabs.astro
- components/unique/GarminData.astro
- components/unique/HackyFormatting.astro
- components/unique/InvisiblesFeature.astro
- components/unique/MediumMaterialsMeat.astro
- components/unique/MysteriousVoid.astro
- components/unique/Tweet.astro
- components/unique/XTimeline.astro
- components/unique/apps
- components/unique/birth-probability
- components/unique/blocks
- components/unique/css-position
- components/unique/gastown
- components/unique/gsap-basics
- components/unique/programmatic-notes
- components/unique/speakularity
- content/essays/ai-dark-forest.mdx
- content/essays/ai-enlightenment.mdx
- content/essays/api.mdx
- content/essays/artisan-data.mdx
- content/essays/bidirectionals.mdx
- content/essays/block-party.mdx
- content/essays/databases.mdx
- content/essays/digital-anthropology.mdx
- content/essays/drawinginvisibles1.mdx
- content/essays/epistemic-ducks.mdx
- content/essays/garden-history.mdx
- content/essays/growing-a-human.mdx
- content/essays/lodestone.mdx
- content/essays/meat-planet.mdx
- content/essays/metaphors-web.mdx
- content/essays/nontechnical-gardening.mdx
- content/essays/paleolithic-nostalgia.mdx
- content/essays/speakularity.mdx
- content/essays/still-cant-draw.mdx
- content/essays/tools-for-thought.mdx
- content/essays/transcopyright-dreams.mdx
- content/essays/xanadu-patterns.mdx
- content/notes/advancedjs.mdx
- content/notes/aesthetic-commands.mdx
- content/notes/ai-aesthetics.mdx
- content/notes/ai-empty-pointer.mdx
- content/notes/ai-profilepics.mdx
- content/notes/ai-rent.mdx
- content/notes/alien-ai.mdx
- content/notes/amnesia-agents.mdx
- content/notes/apps.mdx
- content/notes/babel.mdx
- content/notes/basb.mdx
- content/notes/birth-probability.mdx
- content/notes/building-gatsby-themes.mdx
- content/notes/compilers.mdx
- content/notes/contentful-gatsby.mdx
- content/notes/cozy-web.mdx
- content/notes/cried-eup.mdx
- content/notes/cscl.mdx
- content/notes/css-position.mdx
- content/notes/culinary-drift.mdx
- content/notes/customhooks.mdx
- content/notes/cyborg-history.mdx
- content/notes/cypress.mdx
- content/notes/data-unions.mdx
- content/notes/deep-research.mdx
- content/notes/design-engineers.mdx
- content/notes/digital-anth-books.mdx
- content/notes/dirt.mdx
- content/notes/echo-narcissus.mdx
- content/notes/eponymous-laws.mdx
- content/notes/es2019.mdx
- content/notes/evergreens.mdx
- content/notes/faq.mdx
- content/notes/foc-london.mdx
- content/notes/fruit-comparison.mdx
- content/notes/gastown.mdx
- content/notes/gathering-structures.mdx
- content/notes/generative-forgery.mdx
- content/notes/gift-economy.mdx
- content/notes/git-mistakes.mdx
- content/notes/glitter-devs.mdx
- content/notes/graphql.mdx
- content/notes/greensock-essentials.mdx
- content/notes/greensock-react.mdx
- content/notes/illustrated-gatsby.mdx
- content/notes/illustration-resources.mdx
- content/notes/immer.mdx
- content/notes/interoperable-libraries.mdx
- content/notes/joining-ought.mdx
- content/notes/jsx.mdx
- content/notes/keyboard-fetishism.mdx
- content/notes/keyboard-maestro.mdx
- content/notes/knowledge-hydrant.mdx
- content/notes/learnable-programming.mdx
- content/notes/leaving-elicit.mdx
- content/notes/lm-sketchbook.mdx
- content/notes/maintainers.mdx
- content/notes/metaphor-books.mdx
- content/notes/metatour.mdx
- content/notes/narrative-essays.mdx
- content/notes/natureculture.mdx
- content/notes/neologisms.mdx
- content/notes/newharvest-podcast.mdx
- content/notes/note-oppression.mdx
- content/notes/openings.mdx
- content/notes/paintingroam.mdx
- content/notes/pattern-languages.mdx
- content/notes/post-pull-request.mdx
- content/notes/problematic-proteins.mdx
- content/notes/react-vdom.mdx
- content/notes/react360.mdx
- content/notes/reactsuspense.mdx
- content/notes/reverse-outline.mdx
- content/notes/roam-garden.mdx
- content/notes/running.mdx
- content/notes/silentsessions.mdx
- content/notes/speculative-events.mdx
- content/notes/spinning.mdx
- content/notes/spread.mdx
- content/notes/start-gardening.mdx
- content/notes/summon.mdx
- content/notes/synecdoche.mdx
- content/notes/tana-zotero.mdx
- content/notes/teenage-desktop.mdx
- content/notes/tracking-humanity.mdx
- content/notes/visual-aws.mdx
- content/notes/vuerouter.mdx
- content/notes/vuesocket.mdx
- content/notes/websecurity.mdx
- content/notes/wtf-rust.mdx
- content/notes/xstate.mdx
- content/notes/youre-wrong.mdx
- content/now/2020-09.mdx
- content/now/2021-08.mdx
- content/now/2021-10.mdx
- content/now/2022-07.mdx
- content/now/2022-11.mdx
- content/now/2023-06.mdx
- content/now/2023-09.mdx
- content/now/2023-12.mdx
- content/now/2024-07.mdx
- content/now/2024-12.mdx
- content/now/2025-03.mdx
- content/now/2025-05.mdx
- content/now/2026-01.mdx
- content/now/2026-06.mdx
- content/patterns
- content/podcasts.json
- content/smidgeons/2025-01-common-misconceptions.mdx
- content/smidgeons/2025-01-deepseek.mdx
- content/smidgeons/2025-01-smidgeons.mdx
- content/smidgeons/2025-01-unbaited.mdx
- content/smidgeons/2025-01-undetected.mdx
- content/smidgeons/2025-02-last-exam.mdx
- content/smidgeons/2025-03-chat-gpt-policy.mdx
- content/smidgeons/2025-06-cogitive-debt.mdx
- content/smidgeons/2025-08-persona-vectors.mdx
- content/smidgeons/2025-08-vibe-legacy-code.mdx
- content/talks
Only in /var/folders/vq/zz5zmfk13pg6hzq4y94xjdtr0000gn/T/tmp.YEIT44Zkss/maggie-upstream/maggie-upstream/src/icons
- images/books/ambition.jpg
- images/books/amusing.webp
- images/books/animator.webp
- images/books/annals.webp
- images/books/anthro.webp
- images/books/atlas.webp
- images/books/atlasai.webp
- images/books/bach.webp
- images/books/bazaar.webp
- images/books/beingyou.webp
- images/books/blockchainchicken.webp
- images/books/civilising.webp
- images/books/codingfreedom.webp
- images/books/comics.webp
- images/books/comingofage.webp
- images/books/consciousness.webp
- images/books/creativeillo.webp
- images/books/cue.jpg
- images/books/cyborg.webp
- images/books/dancing-skeletons.webp
- images/books/dancing.webp
- images/books/dawn.webp
- images/books/dealers.webp
- images/books/death-weeping.webp
- images/books/debt.webp
- images/books/descarteserror.webp
- images/books/designthings.webp
- images/books/diviningdigital.webp
- images/books/dontsleep.webp
- images/books/drawnlife.webp
- images/books/dynamic.webp
- images/books/economiescultures.webp
- images/books/emissary.webp
- images/books/empathy.webp
- images/books/empireofpain.jpg
- images/books/encoding.webp
- images/books/essence.webp
- images/books/ethnography9.webp
- images/books/eve.webp
- images/books/everything.webp
- images/books/expecting.jpg
- images/books/finitegames.webp
- images/books/fish.webp
- images/books/flesh.webp
- images/books/force.webp
- images/books/framedink.webp
- images/books/funpencil.webp
- images/books/gathering.webp
- images/books/geometry.webp
- images/books/get-together.webp
- images/books/gift.webp
- images/books/godsupperair.webp
- images/books/goodmother.jpg
- images/books/governing.webp
- images/books/graphicstory.webp
- images/books/historywork.webp
- images/books/howtodraw.webp
- images/books/humanmachine.webp
- images/books/hyperobjects.webp
- images/books/ifthen.webp
- images/books/imagined.webp
- images/books/innovators.webp
- images/books/interpretcultures.webp
- images/books/intuition.webp
- images/books/intuitionpumps.webp
- images/books/invention.jpg
- images/books/iother.webp
- images/books/latthinking.webp
- images/books/lifecode.webp
- images/books/making.jpg
- images/books/making.webp
- images/books/mat.jpg
- images/books/matter.webp
- images/books/meat.webp
- images/books/metahistory.webp
- images/books/metaphorpractical.webp
- images/books/mindmotion.webp
- images/books/ministry.webp
- images/books/modern.webp
- images/books/mushroom.webp
- images/books/mwlb.webp
- images/books/naturalcyborgs.webp
- images/books/newbreed.webp
- images/books/newdarkage.webp
- images/books/newmedia.webp
- images/books/nobody.jpg
- images/books/onkings.webp
- images/books/onwriting.webp
- images/books/orality.webp
- images/books/otherlands.webp
- images/books/otherminds.webp
- images/books/ourbabies.webp
- images/books/participantobs.webp
- images/books/patterns.webp
- images/books/peoplehistory.webp
- images/books/perception.webp
- images/books/progbrain.webp
- images/books/pumps.webp
- images/books/purity.webp
- images/books/radicalmarkets.webp
- images/books/rapidviz.webp
- images/books/ritualprocess.webp
- images/books/robertson.webp
- images/books/sandtalk.webp
- images/books/seeingstate.webp
- images/books/seeingvoices.jpg
- images/books/sketching.webp
- images/books/smallprog.webp
- images/books/social.webp
- images/books/soldiers.jpg
- images/books/speculative.webp
- images/books/staying.webp
- images/books/stoneage.webp
- images/books/style.webp
- images/books/subprime.webp
- images/books/supersize.webp
- images/books/surfaces.webp
- images/books/sweetnesspower.webp
- images/books/tftwaddington.webp
- images/books/theatre.webp
- images/books/theoryvalue.webp
- images/books/thinkertoy.webp
- images/books/timeless.webp
- images/books/toolsthought.webp
- images/books/turing.webp
- images/books/twobits.webp
- images/books/utopia.webp
- images/books/visualexp.webp
- images/books/warmth.jpg
- images/books/waywethink.webp
- images/books/weirdest.webp
- images/books/whattechwants.webp
- images/books/wheretheactionis.webp
- images/books/womenfire.webp
- images/books/wonder.jpg
- images/books/workinginpublic.webp
- images/covers/NH_ProjectThumb.png
- images/covers/UXL2019_Titles-1.png
- images/covers/ai-enlightenment@2x.png
- images/covers/ai-forest@2x.png
- images/covers/api-cover@2x.png
- images/covers/artisan-cover@2x.png
- images/covers/basb-cover@2x.png
- images/covers/bidilinks-cover@2x.png
- images/covers/databases-cover@2x.png
- images/covers/di-cover@2x.png
- images/covers/digianthro@2x.png
- images/covers/dirt-cover@2x.png
- images/covers/egh-thumb.png
- images/covers/fbshirt-thumb.png
- images/covers/gatsbythemethumb.png
- images/covers/googlethumb.png
- images/covers/growing@2x.png
- images/covers/ipad_cover@2x.png
- images/covers/jjs-cover@2x.png
- images/covers/keyboard@2x.png
- images/covers/meatplanet-cover@2x.png
- images/covers/nontech-garden@2x.png
- images/covers/paleo@2x.png
- images/covers/problemproteins-cover@2x.png
- images/covers/purereactthumb.png
- images/covers/puyl-cover@2x.png
- images/covers/rubberduck@2x.png
- images/covers/talk-blocks@2x.png
- images/covers/talk-cyborgs@2x.png
- images/covers/talk-forest@2x.png
- images/covers/talk-homecooked@2.jpeg
- images/covers/talk-invisible@2x.png
- images/covers/talk-picture@2x.png
- images/covers/talk-react@2x.png
- images/covers/talk-sms@2x.png
- images/covers/talk-tft@2x.png
- images/covers/talk-za@2x.jpg
- images/covers/testjsthumb.png
- images/covers/tft@2x.png
- images/covers/transclusion-cover@2x.png
- images/covers/webmetaphors-cover@2x.png
- images/covers/xanadu@2x.png
- images/drawing-invisibles
- images/egghead-covers
- images/general/Brown_1000.jpg
- images/general/Scarf_1000.jpg
- images/general/Stripe2_1000.jpg
- images/podcasts
- images/posts
- images/smidgeons
- pages/design-system.astro
- pages/diagram-preview.astro
- pages/patterns.astro
- pages/podcasts.astro
- pages/rss.xml.js
- pages/smidgeons.xml.js
- pages/talks.astro
- plugins/remark-wiki-link.js
- scripts/create-smidgeon.js
- scripts/generate-links.js
- scripts/generate-topics.ts
- scripts/get-webmentions.js
- scripts/post-links.js
- utils/analyzeTokenUsage.ts
- utils/parseDesignTokens.ts
- utils/slugifyTopic.js
- utils/viewTransitionLifecycle.ts
```

## Source files that differ

98 files

Top changed paths:

```
in assets
componentscomponents/animated-icons/Logo.astro
in BlurImage.astro
componentscomponents/cards/BookCard.astro
componentscomponents/cards/EssayCard.astro
in MusicCard.astro
componentscomponents/cards/NoteCard.astro
in NotebookCard.astro
componentscomponents/cards/NowCard.astro
in PatternCard.astro
in PodcastCard.astro
componentscomponents/cards/ProjectCard.astro
in ResearchCard.astro
in ShortfilmCard.astro
componentscomponents/cards/SmidgeonCard.astro
in TalkCard.astro
in icons
componentscomponents/layouts/Backlinks.astro
componentscomponents/layouts/Footer.astro
componentscomponents/layouts/GrowthStage.astro
componentscomponents/layouts/PageWrapper.astro
componentscomponents/layouts/ProseWrapper.astro
componentscomponents/layouts/TableOfContents.astro
componentscomponents/layouts/TitleWithCount.astro
componentscomponents/layouts/VersionDropdown.astro
componentscomponents/layouts/VersionWarning.astro
componentscomponents/layouts/WebMentions.astro
componentscomponents/layouts/navbar/MainNavLinks.astro
componentscomponents/layouts/navbar/MobileMenu.astro
componentscomponents/layouts/navbar/Navbar.astro
componentscomponents/mdx/AcademicReference.astro
componentscomponents/mdx/Accordion.astro
componentscomponents/mdx/Alert.astro
componentscomponents/mdx/AssumedAudience.astro
componentscomponents/mdx/BackHoverLink.astro
componentscomponents/mdx/BackToTop.astro
in Badge.astro
componentscomponents/mdx/BasicImage.astro
componentscomponents/mdx/ButtonLink.astro
componentscomponents/mdx/ComingSoon.astro
componentscomponents/mdx/Disclaimer.astro
componentscomponents/mdx/Draft.astro
componentscomponents/mdx/Footnote.astro
componentscomponents/mdx/FullWidthBackground.astro
componentscomponents/mdx/GridColumns.astro
componentscomponents/mdx/ImageLink.astro
componentscomponents/mdx/InternalTooltipLink.astro
componentscomponents/mdx/IntroParagraph.astro
in KatexRenderer.astro
componentscomponents/mdx/LinkCard.astro
```

## Recent upstream commits (excluding content)

```
3be9dbb 2026-06-19 Make growth stage label interactive (#227)
313a041 2026-06-11 fix(accordion): improve a11y with aria-expanded (#222)
39c6a17 2026-06-02 fix(garden): hide draft now posts
10f82dd 2026-06-01 Polish mobile menu motion
6ce156e 2026-05-07 fix: allow all HTTPS image sources in CSP for webmention avatars (#219)
fe4f908 2026-05-05 Allow all crawlers including LLMs in robots.txt
b987ad6 2026-05-01 fix(draft-research): allow target input to scan non-draft files (#213)
b587711 2026-05-01 feat: add draft-research gh-aw workflow (#212)
3163af2 2026-05-01 content: update epistemic ducks essay and TOC right padding (#211)
cd4542c 2026-05-01 fix: stop planner workflow infinite-looping on agent-created sub-issues (#210)
eee9cb8 2026-04-30 content: add 'The Post Pull Request World' seedling note (#91)
07c990a 2026-04-28 fix: stop InvisiblesFeature images stretching to fill grid row (#90)
7a8ce80 2026-04-28 fix: self-host broken InvisiblesFeature images on /drawinginvisibles1 (#89)
bb730ad 2026-04-28 fix: transparent garden menu button bg and GitHub capitalisation (#88)
9afc803 2026-04-28 self-host egghead OG images (#84)
e0d78a5 2026-04-28 style(cscl): make citation subtext smaller and sans-serif (#87)
cfb1039 2026-04-28 Fix MysteriousVoid full-width dark section (#86)
fb08951 2026-04-28 improve image quality across egghead and illustrated notes (#83)
260b19e 2026-04-28 fix maintainers page: correct image width and allow transistor.fm in CSP (#82)
84bfa6b 2026-04-28 migrate egghead OG image URLs from now.sh to vercel.app (#81)
7798c81 2026-04-28 allow egghead OG image vercel.app host in CSP (#80)
2f29fad 2026-04-28 allow egghead OG image host in CSP (#79)
c695272 2026-04-28 allow Google Fonts in CSP so Lato loads (#78)
8de2a0b 2026-04-28 fix CSP to unblock YouTube, Vimeo, Figma, R2 videos, and webmention avatars (#77)
a372a42 2026-04-27 add security headers and block AI crawlers (#76)
1354f9b 2026-04-27 update planner workflow to remove skip-if-match condition
73270fd 2026-04-27 block abusive bluesky accounts
8b86236 2026-04-27 add agentation in dev mode
fca0f88 2026-04-27 fix scrolly talk layouts + add zero alignment talk video
12e0d74 2026-04-26 Add introductory paragraph and context for Ace in zero-alignment talk
0ebc0d1 2026-04-25 Fix evergreen and budding growth icons not rendering on cards (#55)
5bae25b 2026-04-25 Merge remote-tracking branch 'origin/main'
816013a 2026-04-25 remove gastown article
e765153 2026-04-25 Fix remaining low-priority view-transition bugs from #40 (#54)
a391480 2026-04-25 [code-quality] Fix DOMContentLoaded usage breaking interactivity after view transitions (#8)
11acbb5 2026-04-25 Fix resize-listener leak in scrollama and GSAP components after SPA navigation (#52)
828d306 2026-04-25 Fix Twitter widgets.js redundant re-injection on SPA navigation (#51)
bb8ac62 2026-04-25 Fix per-image load listener leak in ScrollyTalkSection (#50)
9a22a0e 2026-04-25 Fix squishy side padding on 13" and 14" MacBook Pro screens (#53)
f2d2769 2026-04-25 Restructure agent kit into category folders, add gh-aw pipeline
f25bd0e 2026-04-23 Add agent skills from maggie-agent-kit
359ade9 2026-04-22 Fix topic filter clicks blocked by incomplete popover cleanup (#45)
9fc089e 2026-04-22 Add scroll arrow buttons to garden topic filters (#44)
6f33f5b 2026-04-22 Animate MobileMenu close before navigating (#43)
3d1659b 2026-04-22 Remove Partytown, use plain GA scripts (#42)
47f92f7 2026-04-22 Fix MobileMenu astro:before-preparation listener leak (#41)
cc6075d 2026-04-22 Upgrade garden filters to custom popovers with live counts (#39)
d380ce3 2026-04-21 Replace garden topic filter expand/collapse with horizontal scroll (#38)
e844e1a 2026-04-15 Add extra bottom padding to last ScrollyTalkSection slide (#37)
e61a03f 2026-04-14 Remove ScrollyTalkSection side padding on mobile (#36)
e9ed1fa 2026-04-14 Fix dot separator vertical alignment on card metadata (#35)
a201a8c 2026-04-14 update zero alignment
b3f54df 2026-04-14 Add zero-alignment talk with Cloudflare R2 video hosting (#34)
558a9a4 2026-04-13 Fix FAQ route by lowercasing filename to match Astro 5 slug generation (#33)
7f0e7c1 2026-04-13 Fix inline emojis and font on /drawinginvisibles1 (#32)
61b0439 2026-04-13 fix tft image
e9dd589 2026-04-13 Fix Garmin data viz not rendering on /growing-a-human (#31)
b5102de 2026-04-13 Fix all 15 astro check type errors across 7 files (#29)
276ce2c 2026-04-13 Refactor rss.xml.js: extract prepareBodyContent helper and SANITIZE_OPTIONS (#16)
0219476 2026-04-13 Simplify getCollection switch statement in PostLayout (#15)
7fada52 2026-04-13 Fix View Transitions lifecycle bugs in 5 components (#28)
fee5167 2026-04-13 Add scrollytelling layout for block-data talk (#26)
23efb19 2026-03-17 Fix sort-before-slice bug in index.astro home page
8de1249 2026-02-27 Merge pull request #13 from MaggieAppleton/improve-gettopics-dedup-efd5072fafcaed6c
8dbbd27 2026-02-27 Improve Layout.astro and PostLayout.astro
4b6a1b7 2026-02-26 refactor(utils): extract fetchAllContent helper to eliminate duplication in getTopics
6701af2 2026-02-25 Merge pull request #12 from MaggieAppleton/improve-rss-xml-js-d5ce9af3abe93f8e
516ea14 2026-02-25 Merge pull request #11 from MaggieAppleton/fix/version-dropdown-view-transitions-f23badfc07872340
79d4d05 2026-02-25 Improve rss.xml.js: add JSDoc, eliminate duplicate body parsing
6bd55a3 2026-02-25 Revert duplicate VersionDropdown fix; add open-PR dedup check to code-quality reviewer
023ac16 2026-02-25 Fix VersionDropdown not working after view-transition navigation
d9a4f31 2026-02-25 Remove ISO normalization for start dates
4139a04 2026-02-25 Improve PostLayout.astro: remove stale TODO and extract date helpers
7116bc2 2026-02-25 Remove duplicate PR check from code-quality-improver prompt
fe63881 2026-02-25 Add code-quality-improver agentic workflow
0c77608 2026-01-25 updated build process to skip webmentions locally
0a17ab4 2026-01-25 dark mode diagrams
a13df00 2026-01-24 dark mode
182eb17 2026-01-24 adjust quality prop on images
b71de2e 2026-01-24 add space between toc and paragraph
70ed8cc 2026-01-23 update title
424ecb7 2026-01-23 title update
a520b0f 2026-01-23 fixing small bits and pieces
085f522 2026-01-23 completing the gastown post!
318e312 2026-01-23 adding quality controls to images
f840dfe 2026-01-21 draft updates
1dc0761 2026-01-19 drafts
e75b6ac 2026-01-17 diagrams
eeb2d4d 2026-01-16 diagram cleanup
449a1b9 2026-01-16 diagram fixes
80725fb 2026-01-16 add icons to ds
1a8dac3 2026-01-16 design system tweaks
3d8d99c 2026-01-16 cleanup local dev design system
7705440 2026-01-15 draft updates
bf8dbca 2026-01-15 add local design system
ad7c029 2026-01-15 draft updates
5f13f8c 2026-01-12 update draft
e3f8c15 2026-01-12 new quote source component
00e235a 2026-01-11 fixed toc bug
8b0ebc9 2026-01-10 gt update
5948f45 2026-01-06 fix accordion bug
33090d6 2026-01-03 gastown update
493262b 2026-01-03 gastwon draft
92aa90c 2026-01-02 Update Tweet component mobile padding - add 6px vertical and 2px horizontal padding
8f715a1 2026-01-02 fix double link highlight
aed5a33 2026-01-02 new drafts
52c3b96 2026-01-02 publish new now post
69bffce 2026-01-02 display now post drafts in dev
b40c9b0 2026-01-02 fix pencil build error
39a4c80 2026-01-02 updated gitignore
37bf4a2 2025-11-02 fix fruit img paths
0c49d9c 2025-10-29 rename claude to agents
0a93f9f 2025-10-29 fix image source bug
11b98ef 2025-10-29 fix image fallback
4c2eb2f 2025-10-29 add missing tsx dev dep
011e850 2025-10-09 updated about page
a4f5775 2025-10-09 updated job on homepage
ab89ab1 2025-09-03 updated versioning system docs
bb78e5f 2025-08-31 updated job status
12535f8 2025-08-20 fix og images for versioned posts
b5bae3a 2025-08-20 Merge version control feature
bc90605 2025-08-20 remove temp versioned content
3f18c4b 2025-08-20 styling and mobile on versioned content
c3e3fc4 2025-08-20 added versioning support to backlinks
245bd29 2025-08-20 updated versioning docs
ee2924d 2025-08-20 styling fixes on version dropdown
f780dd6 2025-08-20 Fixed keyboard accessibility navigation issue inside version dropdown.
960a45a 2025-08-20 Styled the version warning component
ade995d 2025-08-19 Fix canonical date display across all content versions
9e8b7a4 2025-08-14 added lucide icons
1da8024 2025-08-12 fix animation trigger bugs in main menu
0336ce9 2025-08-12 design of version control
0e48328 2025-08-11 Merge branch 'main' of https://github.com/MaggieAppleton/maggieappleton.com-V3
80b821e 2025-08-11 Fix topic matching for topics with hyphens
9ad39d0 2025-08-11 Update README.md
80c9503 2025-08-11 Update README.md
7c812be 2025-08-11 Fix RSS feed image paths to use absolute URLs
9fc0c0f 2025-08-11 claude md update
c8e549e 2025-08-11 temp design fix on version control
a0b8695 2025-08-09 Optimize OG image generation for versioned content
137d8f9 2025-08-09 Fix navigation URLs for versioned content
22faa17 2025-08-09 Implement folder-based versioning system
3cea352 2025-08-09 Fix version navigation for filename-based versioning system
0a8e61b 2025-08-08 Simplify frontmatter by inferring version metadata from filenames
e78d7ef 2025-08-08 fix: resolve variable scope issue in VersionNavigation component
126690e 2025-08-08 feat: implement content versioning system
d8b5e53 2025-08-08 add claude code guide
bee02c7 2025-08-08 webmentions fix bluesky replies
4bf8193 2025-08-06 add links, revise deploy script
1ad9889 2025-08-06 remove double links
039629b 2025-08-06 ship ai enlightenment
d961911 2025-08-06 make ai enlightenment an essay
1e39127 2025-08-05 fix toc loading bug
ffee434 2025-08-05 publishing the ai enlightenment piece
af8fbd8 2025-08-04 adapted link card to work better
e8908b6 2025-08-03 cleaned up client-side JS after view transitions
14829f8 2025-08-03 yet another filter fix
a3cbefe 2025-08-03 fix filters
044ada6 2025-08-03 fixing garden filters
6a81fd7 2025-08-03 adding drafts
6f20a25 2025-08-03 fixing garden filters
7c23c9b 2025-08-03 fixing garden filters
4211d2c 2025-08-02 fixed icon display issue
2099c64 2025-08-02 published vibe coding
056984f 2025-08-02 updated the smidgeons script
0e94495 2025-08-02 fixed image and video component bugs
8b67e61 2025-08-02 added view transitions
0894d23 2025-08-02 updated language from 'retweet' to 'report'
2f7cb4d 2025-08-02 small animation fix
cc7e879 2025-08-02 added a mega menu in the nav
e5b562e 2025-08-01 styling fix on smidgeons
83a9088 2025-08-01 updated drafts layout and status
2f85e6b 2025-08-01 added back link  to garden on smidgeons
fbf2f7a 2025-08-01 deploy script updates
35e79ec 2025-08-01 put smidegons on the garden index
7539f6b 2025-08-01 updated deploy script
088a8d0 2025-07-12 fixed broken loho animation
69f92c0 2025-06-08 adjusted line height styling inconsistencies
6529f23 2025-06-07 shipping the hire me page
d61859f 2025-06-07 updated my about page
63ad8ba 2025-06-07 fixed podcast dates not showing on garden
97cd9f9 2025-06-06 Added better navigation between now pages in the garden
af716c3 2025-06-06 fixed now date error in RSS
a16955f 2025-06-06 Feature Complete
490b7e7 2025-06-06 Completed adding Now posts to the main Garden index page and topic pages
be62a09 2025-06-06 refined cursor rules
ff712b0 2025-06-06 fixed date
4be5ae9 2025-06-06 integrating now posts into garden page, incomplete
11fb02b 2025-06-06 updated cursor rules
c89f6f1 2025-06-05 Added new Cursor Agent functionality.
84e9ba4 2025-04-25 added soliders and kings to library
ae624ab 2025-04-25 added parenting tag
8797081 2025-03-25 cleaned up data
87f447c 2025-03-24 birth probs updat
a91b89a 2025-03-24 adjusted values
de138d8 2025-03-24 small design adjustments
2e47294 2025-03-24 finished birth probabilities chart
567d930 2025-03-23 birth probs updates
81d7916 2025-03-22 more cleanup
737f4a6 2025-03-22 improved birth data accuracy, started reformatting design
05c5e80 2025-03-21 added birth probs calculator
9692069 2025-03-21 added cursor rules
6399f20 2025-03-13 smidgeon on chatgpt policy
9815154 2025-03-05 tweaks
334d96e 2025-03-05 added now post lodestone images
b826eba 2025-03-05 made now pages compatible with RSS
0cd2331 2025-03-05 updated logic to exclude drafts, wrote new now post
147f79b 2025-03-05 added new books
00732bb 2025-02-20 drafts
07e25f3 2025-02-20 last exam smidgeon
380de4e 2025-01-26 added OG images to smidgeons
08d2b8b 2025-01-26 styling fix
f5d009d 2025-01-26 added deepseek
9e32044 2025-01-25 fixed random image selector on about pahe
4ff9607 2025-01-15 formatting fixes
a447290 2025-01-13 add smidgeons to mobile menu
451c590 2025-01-13 stripped MDX from RSS content, replaced images with inline imgs
b2d18c8 2025-01-13 updated readme
6228074 2025-01-13 added standalone rss feed for smidgeons
d7605dc 2025-01-12 spell checked
78fd9ba 2025-01-12 typo and spacing fix
a512f18 2025-01-12 updated rss feed
0a8dfa7 2025-01-12 fixed layout of smidegons and types and titles
59cf05a 2025-01-12 added links to smidgeons rss content
f69a20c 2025-01-12 add smidgeons to rss
04c4f86 2025-01-12 updated smidgeons
d57e324 2025-01-12 adding links to smidgeons
5abe61e 2025-01-12 shipping smidgeons
ef5622b 2025-01-12 updated speakularity
4ef9ff6 2025-01-12 fixed svg overflow on basic images
e7d96c7 2025-01-12 fixed vs code settings
35564db 2025-01-12 fixed prettier formatting settings
c046a88 2025-01-12 fixed accordion responsive styles
d8f1f0f 2025-01-12 fixed the accordian spacing
312af46 2025-01-10 fix attemtp
70354c5 2025-01-10 debugging webmentions
23969c0 2025-01-10 fixing url
835b483 2025-01-10 trying to fix webmentions
8c6d3aa 2025-01-10 attempt to fix webmentions
ba70521 2025-01-10 added webmentions in head
f648e26 2025-01-09 initial tft talk update
2731fd8 2025-01-07 fix weird leading bug in page layouts
4a479c3 2025-01-07 wrote up tana zotero import process
eedfde5 2025-01-07 added topics and smidgeons infra
4658036 2025-01-06 added new breed to books
585a18b 2025-01-05 Moved TOC to left-hand side out of the way
69c4045 2025-01-05 added backlinks to growing a human
5844d22 2025-01-04 fixed position of icon on note cards
a4291c8 2025-01-04 adjusted cover size
3896e7e 2025-01-04 featured growing a human
39be831 2025-01-04 enourmous volumes of work on growing a human
573e61b 2025-01-04 fixed spacing issue on academic references
a6e0f03 2025-01-03 console log cleanup
13169d1 2025-01-03 updated default OG image
ded605f 2025-01-03 added og images
c7f0286 2025-01-03 reset before adding og images
d0d088a 2025-01-02 added bananas to growing and wrote lots
f53626d 2025-01-02 made toc lick target larger
3898fb5 2025-01-02 fixed toc type bug
d8f67fa 2025-01-02 updated barefoot devs talk and added hanselminutes pod
b64339f 2025-01-02 adjusted TOC behaviour
1fb7489 2025-01-02 updated growing images
dec867f 2025-01-01 improved table of contents button
f9e462b 2025-01-01 implemented table of contents, more writing
24b19d9 2024-12-31 more graphing and updated images
9116c29 2024-12-31 more work on the elaborate graph
805836d 2024-12-31 wrote more on growing and speakularity. made an elaborate graph
867f050 2024-12-31 added titktok embed component
6145c85 2024-12-30 Refactored columns into unified component, updated all instances
b5755c3 2024-12-30 fixed favicon
ab04b9c 2024-12-30 Update README.md
dec91c6 2024-12-30 removed background colour from images
6ec14f8 2024-12-30 fixed gif elements and footnote link line breaks
46e9ea4 2024-12-30 Merge branch 'main' of https://github.com/MaggieAppleton/maggieappleton.com-V3
33e4dfa 2024-12-30 cleaning up images
4559e6e 2024-12-30 cleaned up garden filters for bugs
5941ee0 2024-12-30 mobile spacing adjustments
6df4077 2024-12-30 Update README.md
d2ada77 2024-12-30 Update README.md
5c8deb3 2024-12-30 Update README.md
6222e72 2024-12-30 reimplemented mobile menu
0321d7f 2024-12-30 stripped out view transitions and mobile menu
6c76c7a 2024-12-29 fix mobile menu
431f887 2024-12-29 fixing layout overflows
e60eddc 2024-12-29 fixed quote citation bug
52772ab 2024-12-29 new deploy script
1ed03b4 2024-12-29 Update site
27a5bbc 2024-12-29 fixed rss feed
8cd7fe0 2024-12-29 cleanup
c49ee63 2024-12-29 fixed mobile overflow issues
cf25945 2024-12-29 attempted fix
942f7bb 2024-12-29 cleanup
ffd3f74 2024-12-29 fix?
f3c3319 2024-12-29 build error fixes
420525b 2024-12-29 formatting fix
06f96d2 2024-12-29 formatting fix
aedd0d7 2024-12-29 fixed block party components
427b9ed 2024-12-29 fixed animations and syntax highlighting
1e37fa7 2024-12-29 fixed filtering with page view transitions
6d95c27 2024-12-29 fixed scrolling image sizes and overlap problems
cd5469a 2024-12-29 fixed scrolling images
bda813a 2024-12-28 omg so much scroll animation fixing
65b0c4d 2024-12-28 component style fixes
75760ea 2024-12-28 cleaned up lots of posts, styling and formatting
84fa75a 2024-12-28 fixed small styling bugs
612b3fb 2024-12-28 fixing link styling and updating webmention conditional rendering
5f3b4c9 2024-12-28 fixing tooltips and formatting
8b23ae1 2024-12-28 removed console logs
ce936fa 2024-12-28 made webmentions work
80412ce 2024-12-28 cleaning up import
048153d 2024-12-28 formatting fixes
5512d32 2024-12-28 added page transitions and a new now post
41d8f3b 2024-12-28 fixed drafts in backlinks, adjusted spacing
0bcfc40 2024-12-28 styling tweaks, adjust tags
68fc478 2024-12-28 updated colophon and fixed component styling
3276cc9 2024-12-27 updated colophon
0838c64 2024-12-27 styled filters
8b1b597 2024-12-27 added topic filtering and fixed masonry bugs
6e4e7a6 2024-12-27 added rss feed
e53f50a 2024-12-27 analytics setup
badf4bc 2024-12-27 enabled drafts on now posts
9a8dc73 2024-12-27 fixed now pages
e136909 2024-12-27 added topic pages and links back to the garden on all categories
58e74b5 2024-12-24 fixed backlinks above post titles
35b3ca7 2024-12-24 fixed hover links on index page
a8a19d3 2024-12-24 fixing intro paragraph formatting
72ce8e6 2024-12-23 fixed the dates
b999475 2024-12-23 made backlinks visible on post pages
8d780c4 2024-12-23 fixed talk slide typography
710447d 2024-12-23 cleaned up backlinks, fixed footnotes
9a083ca 2024-12-22 made backlinks work
a41961e 2024-12-21 bugs n bugs
3153ba3 2024-12-21 imported all now entries
31ca1ce 2024-12-21 troubleshooting links
1950b8f 2024-12-21 fixed title count issue
e6d0505 2024-12-21 layout, dates, and masonry fixes
7bb5d2c 2024-12-20 fixing individual type listing pages
80e2102 2024-12-20 fixed image issues, added books, fixed sorting issues
af9f2c7 2024-12-20 ripped out algolia, fixing display bugs
b375e58 2024-12-19 working on getting algolia working
d62e10b 2024-12-19 fixed up index page and cards
343d492 2024-12-19 brought over majority of pages and layout components
10ef10d 2024-12-19 added books, pods, and formatted unique components
355d4b0 2024-12-15 added and fixed all the drrafts and made a drafts page
bb00854 2024-12-15 updated talk formats and fixed type errors
398791e 2024-12-15 formatted all the notes
21434f6 2024-12-15 pattern files and images cleanup
9e6be28 2024-12-15 lots of formatting and clean up on pattern files
3c8f976 2024-12-12 removed extra images, formatted more essays
103474d 2024-12-12 cleaned up image component, cleaned more essays, added unique components to be converted
e8d6918 2024-12-12 fixed first couple essays, added more images
12a90ae 2024-12-12 added styled tweets embeds
14ed5be 2024-12-12 added all essay content - need to reformat and debug
3aa2c1a 2024-12-11 added remote image support
f79893e 2024-12-11 fixed images
a8e7724 2024-12-08 added more test posts, began troubleshooting images
5b821c2 2024-12-08 converted more components
b99f35b 2024-12-08 converted more components
37a5606 2024-12-08 (mostly) fixed top navigation
98f05bd 2024-12-08 added core layout components
b673d3d 2024-12-07 fixed footnotes
de6fbb8 2024-12-07 added link components
28b26be 2024-12-07 fixed tooltips
744bbb4 2024-12-07 added bulk of mdx components
9a20cd7 2024-12-06 added breakpoint utils
5cf1cd2 2024-12-06 added base layouts
5200ed2 2024-12-05 added more mdx components
5149b1f 2024-12-05 MVP of core features
5b33334 2024-12-05 Update README.md
affbd37 2024-12-05 Update README.md
fcbacc8 2024-12-04 initial working version
ef8ad25 2024-12-04 Initial commit from Astro
```

## Notable component presence

Components present only upstream (candidates to consider porting):

- ScrollyTalkSection.astro

---

*Generated by `scripts/comparison/compare-upstream.sh`*
