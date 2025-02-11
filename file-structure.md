(base) ➜  hyper-baby-app git:(feat/#3-chart-analysis) tree
.
├── LICENSE
├── README.md
├── app
│   ├── (auth)
│   │   ├── actions.ts
│   │   └── login
│   │       └── page.tsx
│   ├── (chat)
│   │   ├── actions.ts
│   │   ├── api
│   │   │   ├── chat
│   │   │   │   └── route.ts
│   │   │   ├── document
│   │   │   │   └── route.ts
│   │   │   ├── files
│   │   │   │   └── upload
│   │   │   │       └── route.ts
│   │   │   ├── history
│   │   │   │   └── route.ts
│   │   │   ├── privy.ts
│   │   │   ├── suggestions
│   │   │   │   └── route.ts
│   │   │   └── vote
│   │   │       └── route.ts
│   │   ├── chat
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── opengraph-image.png
│   │   ├── page.tsx
│   │   └── twitter-image.png
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
├── biome.jsonc
├── components
│   ├── PrivyProvider.tsx
│   ├── app-sidebar.tsx
│   ├── auth-form.tsx
│   ├── background-squares.tsx
│   ├── block-actions.tsx
│   ├── block-close-button.tsx
│   ├── block-messages.tsx
│   ├── block.tsx
│   ├── chat-header.tsx
│   ├── chat.tsx
│   ├── code-block.tsx
│   ├── code-editor.tsx
│   ├── console.tsx
│   ├── crypto-price.tsx
│   ├── data-stream-handler.tsx
│   ├── diffview.tsx
│   ├── document-preview.tsx
│   ├── document-skeleton.tsx
│   ├── document.tsx
│   ├── editor.tsx
│   ├── gradient-text.tsx
│   ├── icons.tsx
│   ├── image-editor.tsx
│   ├── markdown.tsx
│   ├── message-actions.tsx
│   ├── message-editor.tsx
│   ├── message.tsx
│   ├── messages.tsx
│   ├── model-selector.tsx
│   ├── multimodal-input.tsx
│   ├── overview.tsx
│   ├── preview-attachment.tsx
│   ├── run-code-button.tsx
│   ├── shiny-text.tsx
│   ├── sidebar-history.tsx
│   ├── sidebar-toggle.tsx
│   ├── sidebar-user-nav.tsx
│   ├── submit-button.tsx
│   ├── suggested-actions.tsx
│   ├── suggestion.tsx
│   ├── theme-provider.tsx
│   ├── toolbar.tsx
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── use-scroll-to-bottom.ts
│   ├── version-footer.tsx
│   ├── visibility-selector.tsx
│   └── weather.tsx
├── components.json
├── drizzle.config.ts
├── file-structure.md
├── hooks
│   ├── use-block.ts
│   ├── use-chat-visibility.ts
│   ├── use-mobile.tsx
│   ├── use-multimodal-copy-to-clipboard.ts
│   └── use-user-message-id.ts
├── lib
│   ├── ai
│   │   ├── custom-middleware.ts
│   │   ├── index.ts
│   │   ├── models.ts
│   │   └── prompts.ts
│   ├── db
│   │   ├── migrate.ts
│   │   ├── migrations
│   │   │   ├── 0000_charming_songbird.sql
│   │   │   ├── 0001_quick_the_fury.sql
│   │   │   └── meta
│   │   │       ├── 0000_snapshot.json
│   │   │       ├── 0001_snapshot.json
│   │   │       └── _journal.json
│   │   ├── queries.ts
│   │   └── schema.ts
│   ├── editor
│   │   ├── config.ts
│   │   ├── diff.js
│   │   ├── functions.tsx
│   │   ├── react-renderer.tsx
│   │   └── suggestions.tsx
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── production.md
├── public
│   ├── fonts
│   │   ├── geist-mono.woff2
│   │   └── geist.woff2
│   └── images
│       ├── demo-thumbnail.png
│       └── hand.png
├── tailwind.config.ts
└── tsconfig.json

27 directories, 119 files