/**
 * PromptForge - AI Prompt Architect Schema Definitions
 * Provides archetypes, detailed section questionnaires, granular UI/UX options,
 * dynamic custom answer capabilities, and tech stack dependencies.
 */

window.JAT_SCHEMA = {
  archetypes: [
    {
      id: "portfolio",
      name: "Portfolio / Personal Site",
      badge: "Popular",
      subtitle: "Showcase your work, case studies, experience, and contact details with style.",
      icon: "user",
      sections: [
        {
          id: "navigation",
          name: "Navigation & Header",
          icon: "nav",
          description: "Top navigation bar, personal branding, anchor links, and mobile responsiveness.",
          questions: [
            {
              id: "nav_layout",
              label: "Navbar Layout & Style",
              help: "Positioning and backdrop styling of the main header navigation.",
              type: "single",
              options: [
                "Sticky with backdrop blur",
                "Fixed top with border",
                "Floating pill navbar",
                "Minimalist centered logo",
                "Sidebar vertical navigation"
              ],
              allowCustom: true
            },
            {
              id: "nav_branding",
              label: "Logo & Branding",
              help: "How your identity and personal branding is displayed.",
              type: "single",
              options: [
                "Icon + Bold Text",
                "Monogram avatar icon",
                "SVG badge logo",
                "Minimal text typography only"
              ],
              allowCustom: true
            },
            {
              id: "nav_links",
              label: "Navigation Links & CTA",
              help: "Action buttons and primary navigation items.",
              type: "single",
              options: [
                "Standard links + \"Get Started\" button",
                "Links with dropdown submenus",
                "Icon-only mobile responsive bar",
                "Minimalist anchor scroll"
              ],
              allowCustom: true
            },
            {
              id: "nav_styling",
              label: "Navbar Color Scheme & Spacing",
              help: "Visual palette, surface treatment, and container width.",
              type: "single",
              options: [
                "Dark slate with subtle border",
                "Glassmorphism translucent effect",
                "Solid clean white with shadow",
                "Vibrant gradient accent border"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "hero",
          name: "Hero Section",
          icon: "hero",
          description: "First impression, value proposition, headline, and primary call to actions.",
          questions: [
            {
              id: "hero_headline",
              label: "Hero Headline & Value Proposition",
              help: "The messaging style and statement formula.",
              type: "single",
              options: [
                "Senior Engineer / Architect Title + Bold Mission Statement",
                "Impact Driven: 'Crafting high-performance, delightful web experiences'",
                "Interactive Terminal Prompt: 'developer@portfolio:~$ whoami'",
                "Minimalist Editorial Statement with Accent Highlight"
              ],
              allowCustom: true
            },
            {
              id: "hero_visuals",
              label: "Hero Visuals & Media",
              help: "Visual anchors and decorative interactive elements.",
              type: "single",
              options: [
                "Interactive 3D Avatar / Portrait with Glow Ring",
                "Live Floating Tech Stack Badge Pills",
                "Interactive Code Playground / Terminal Preview Card",
                "Minimal Particle / Subtle Mesh Gradient Backdrop"
              ],
              allowCustom: true
            },
            {
              id: "hero_cta",
              label: "Call to Action (CTA) Configuration",
              help: "Primary buttons and visitor conversion triggers.",
              type: "single",
              options: [
                "Dual Buttons: 'View Selected Work' & 'Get in Touch'",
                "Single High-Focus: 'Hire Me / Schedule a Call'",
                "Direct Resume Download with Instant PDF Preview",
                "Interactive 'Copy Email' with Toast Notification"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "projects",
          name: "Projects / Work Grid",
          icon: "projects",
          description: "Project showcase, case studies, filtering, and interactive preview modals.",
          questions: [
            {
              id: "proj_layout",
              label: "Project Showcase Layout",
              help: "Layout architecture for displaying featured projects.",
              type: "single",
              options: [
                "Bento Box Asymmetric Grid with Featured Cards",
                "2-Column Responsive Cards with Image Zoom on Hover",
                "Interactive Tabbed Slider / Carousel with Pagination",
                "Clean Minimalist List View with Expandable Drawers"
              ],
              allowCustom: true
            },
            {
              id: "proj_filtering",
              label: "Filtering & Category Tabs",
              help: "How visitors filter projects by skill or domain.",
              type: "single",
              options: [
                "Pill Filter Buttons (All, Web Apps, Mobile, Open Source)",
                "Tech Tag Live Search Input with Instant Filtering",
                "Curated Chronological Showcase (No Filter, High Focus)",
                "Dropdown Select with Project Count Indicators"
              ],
              allowCustom: true
            },
            {
              id: "proj_card_data",
              label: "Project Card Content Elements",
              help: "Key metadata presented on each project card.",
              type: "single",
              options: [
                "Thumbnail + Tech Badges + Live Demo & GitHub Links",
                "Metrics Highlight (e.g., '+40% Performance') + Deep Case Study",
                "Interactive Live Iframe Preview on Hover",
                "Minimal Title, Short Impact Summary & Arrow Trigger"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "skills",
          name: "About & Skills",
          icon: "skills",
          description: "Technical proficiencies, bio narrative, and experience milestones.",
          questions: [
            {
              id: "skills_presentation",
              label: "Skills Presentation Format",
              help: "Visual arrangement of tech proficiencies.",
              type: "single",
              options: [
                "Categorized Grid with SVG Logos (Frontend, Backend, DevOps, Tools)",
                "Infinite Scrolling Marquee Ticker of Tech Logos",
                "Interactive Skill Chips with Experience Tooltips",
                "Bento Highlights of Core Masteries + Tag Clouds"
              ],
              allowCustom: true
            },
            {
              id: "skills_bio",
              label: "Experience & Bio Layout",
              help: "How your personal story and work history are organized.",
              type: "single",
              options: [
                "Concise 2-Paragraph Founder/Engineer Bio + Career Milestone Timeline",
                "Interactive Tabbed Career Experience (Companies & Roles)",
                "Key Metrics Bar (Years Experience, Apps Built, Happy Clients)",
                "Engineering Philosophy & Architecture Principles"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "contact",
          name: "Contact Section",
          icon: "contact",
          description: "Lead capture, inquiry forms, social channels, and scheduling links.",
          questions: [
            {
              id: "contact_layout",
              label: "Contact Area Structure & Form",
              help: "The layout of the contact section.",
              type: "single",
              options: [
                "Split Screen: Direct Contact Info Left, Functional Form Right",
                "Centered Minimalist Form with Floating Labels",
                "Social-First Card Grid (GitHub, LinkedIn, X/Twitter, Email)",
                "Embedded Cal.com / Calendly Meeting Scheduler Widget"
              ],
              allowCustom: true
            },
            {
              id: "contact_validation",
              label: "Form Fields & Validation Feedback",
              help: "User experience during and after form submission.",
              type: "single",
              options: [
                "Name, Email, Project Budget Select & Message + Instant Toast",
                "Quick Inquiry: Email & Message Only (Frictionless)",
                "Modal Confirmation Dialog with Celebratory Confetti",
                "Native Mailto / Webhook API Handler"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    },
    {
      id: "dashboard",
      name: "SaaS Dashboard",
      badge: "Advanced",
      subtitle: "Web application with metrics, user management, billing, analytics, and sidebar navigation.",
      icon: "chart",
      sections: [
        {
          id: "sidebar_nav",
          name: "Sidebar & Navigation",
          icon: "sidebar",
          description: "Collapsible sidebar, top utility header, search, and user profile drawer.",
          questions: [
            {
              id: "dash_nav_layout",
              label: "Sidebar Layout & Behavior",
              help: "Navigation menu structure and collapsible state.",
              type: "single",
              options: [
                "Fixed Left Sidebar with Icon + Text (Collapsible to mini-rail)",
                "Floating Island Left Sidebar with Glassmorphism Border",
                "Top Horizontal App Bar with Mega-menu Dropdowns",
                "Dual Multi-level Sidebar with Nested Submenus"
              ],
              allowCustom: true
            },
            {
              id: "dash_header_elements",
              label: "Top Bar Elements & User Profile",
              help: "Utilities located in the top navigation strip.",
              type: "single",
              options: [
                "Global Cmd+K Search + Notification Bell + User Avatar Dropdown",
                "Breadcrumbs Navigation + Quick Action '+ New Item' Button",
                "Organization Switcher + Dark/Light Theme Toggle Pill",
                "Environment Badge (Production/Staging) + Help Center Link"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "kpi_metrics",
          name: "KPI Metrics & Summary Cards",
          icon: "metrics",
          description: "Executive metrics, trend comparison indicators, and sparklines.",
          questions: [
            {
              id: "metric_count_layout",
              label: "Metrics Cards Layout",
              help: "Number of metrics and arrangement across the top grid.",
              type: "single",
              options: [
                "4-Column Metric Cards (Revenue, Users, Churn, MRR Growth)",
                "3-Column Large Executive Bento Cards with Embedded Sparklines",
                "Horizontal Scrolling Metric Strip with Real-time Counters",
                "Customizable Widget Grid with Drag-and-drop Rearrange"
              ],
              allowCustom: true
            },
            {
              id: "metric_card_details",
              label: "Trend & Comparison Indicators",
              help: "How period-over-period performance is visualized.",
              type: "single",
              options: [
                "Percentage Pill (+12.4% vs last month) with Green/Red Badges",
                "Mini Area Sparkline inside each card",
                "Target Goal Progress Bar (% of quarterly quota)",
                "Clean Minimal Numbers with Subtext Description"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "charts",
          name: "Data Visualization & Charts",
          icon: "chart",
          description: "Interactive data charts, time range filtering, and export tools.",
          questions: [
            {
              id: "chart_type_layout",
              label: "Primary Chart Architecture",
              help: "Main analytics visualizations displayed.",
              type: "single",
              options: [
                "Full-Width Smooth Area Chart (Revenue & Activity over time)",
                "Split View: Left Area Chart, Right Doughnut Category Breakdown",
                "Multi-Series Bar Chart with Segment Toggle",
                "Heatmap Activity Matrix with Tooltips"
              ],
              allowCustom: true
            },
            {
              id: "chart_controls",
              label: "Time Range & Interval Filters",
              help: "How users filter the visualization timeframe.",
              type: "single",
              options: [
                "Pill Selector (Today, 7D, 30D, YTD, All Time)",
                "Date Range Picker with Calendar Popover",
                "Granularity Switcher (Hourly, Daily, Weekly, Monthly)",
                "Live Realtime Stream Toggle with Pulsing Status Indicator"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "data_table",
          name: "Data Table & Record Management",
          icon: "table",
          description: "Tabular record viewer, sorting, batch actions, and pagination.",
          questions: [
            {
              id: "table_features",
              label: "Table Controls & Pagination",
              help: "Key table interactive capabilities.",
              type: "single",
              options: [
                "Instant Text Search + Column Sort + Numbered Pagination",
                "Filter Facets Drawer + Infinite Scroll with Skeleton Loaders",
                "Custom Column Visibility Toggle + Density Selector (Compact/Spacious)",
                "Inline Quick Editing on Row Click"
              ],
              allowCustom: true
            },
            {
              id: "table_actions",
              label: "Row Selection & Batch Actions",
              help: "Handling multi-record management.",
              type: "single",
              options: [
                "Checkbox Selection -> Floating Sticky Batch Action Bar (Delete, Export, Tag)",
                "Single Row Action Dropdown (Edit, View, Duplicate, Archive)",
                "Slide-over Quick View Drawer on row click",
                "Direct Status Toggle Pill in table cells"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    },
    {
      id: "ecommerce",
      name: "E-Commerce Store",
      badge: "High Conversion",
      subtitle: "Product catalog, shopping cart, checkout flow, filter tags, and product modals.",
      icon: "bag",
      sections: [
        {
          id: "header_cart",
          name: "Header, Brand & Cart Bar",
          icon: "header",
          description: "Storefront navigation, mega-menu, search, and dynamic cart badge.",
          questions: [
            {
              id: "ecom_nav_layout",
              label: "Header Navigation & Search",
              help: "Store header layout and search capabilities.",
              type: "single",
              options: [
                "Sticky Header with Center Logo, Category Links & Live Search Modal",
                "Dual Strip: Top Announcement Bar + Main Navigation Bar",
                "Minimalist Floating Header with Icon Triggers",
                "Full-Width Search Bar prominent above navigation"
              ],
              allowCustom: true
            },
            {
              id: "ecom_cart_badge",
              label: "Cart Counter & Sticky Trigger",
              help: "How shopping cart status is communicated to the shopper.",
              type: "single",
              options: [
                "Header Cart Icon with Animated Counter Badge + Price Subtotal",
                "Floating Circular Cart Button in bottom-right corner",
                "Slide-over Cart Mini-drawer trigger on every 'Add to Cart'",
                "Compact notification toast with 'View Cart' link"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "catalog",
          name: "Product Catalog & Filtering",
          icon: "catalog",
          description: "Product card layout, facet filters, sort dropdown, and badges.",
          questions: [
            {
              id: "ecom_grid_layout",
              label: "Product Catalog Grid",
              help: "Grid density and card proportions.",
              type: "single",
              options: [
                "3-Column Responsive Grid with Large Photography & Quick Add",
                "4-Column High-Density Grid with Color Swatches",
                "Dynamic Bento Layout with Highlighted Featured Drops",
                "List View with Detailed Spec Matrix"
              ],
              allowCustom: true
            },
            {
              id: "ecom_filters",
              label: "Facet Filtering & Sorting",
              help: "How shoppers narrow down product selections.",
              type: "single",
              options: [
                "Left Sidebar Facet Filter (Category, Price Range Slider, Size, Color)",
                "Top Horizontal Filter Pill Bar with Multi-select",
                "Slide-in Filter Drawer (Mobile & Desktop optimized)",
                "Instant Live Search with Price & Tag Autocomplete"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "cart_checkout",
          name: "Cart Drawer & Checkout Flow",
          icon: "checkout",
          description: "Slide-over cart experience, coupon input, and multi-step checkout.",
          questions: [
            {
              id: "ecom_cart_features",
              label: "Cart Drawer Experience",
              help: "Features inside the slide-over cart panel.",
              type: "single",
              options: [
                "Slide-over Drawer: Quantity Stepper, Promo Code, Free Shipping Progress Bar",
                "Full Page Cart View with Item Recommendations",
                "One-Click Express Checkout Buttons (Apple Pay, Google Pay, Stripe)",
                "Modal Pop-up with Order Summary"
              ],
              allowCustom: true
            },
            {
              id: "ecom_checkout_layout",
              label: "Checkout & Payment Flow",
              help: "Customer checkout steps and security reassurance.",
              type: "single",
              options: [
                "One-Page Accordion Checkout (Shipping, Billing, Payment in one view)",
                "Multi-Step Guided Wizard (1. Contact, 2. Shipping, 3. Payment)",
                "Minimalist Clean Stripe Elements embed with Trust Badges",
                "Guest Checkout prioritized with optional Account Creation"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    },
    {
      id: "blog",
      name: "Blog & Content Hub",
      badge: "Clean UI",
      subtitle: "Article listings, rich reading layouts, category tags, search bar, and newsletter signups.",
      icon: "newspaper",
      sections: [
        {
          id: "blog_feed",
          name: "Article Feed & Grid",
          icon: "feed",
          description: "Featured article hero, article cards, topic filters, and author badges.",
          questions: [
            {
              id: "blog_feed_layout",
              label: "Feed Layout Architecture",
              help: "Arrangement of articles on the main blog index.",
              type: "single",
              options: [
                "Hero Featured Article Banner + 3-Column Card Grid below",
                "Editorial Magazine Layout with Asymmetric Columns",
                "Clean Minimalist Single-Column Stream with Read Time Badges",
                "Card Grid with Topic Badge Pills and Hover Zoom"
              ],
              allowCustom: true
            },
            {
              id: "blog_filtering",
              label: "Topic Filtering & Search",
              help: "How readers browse topics and categories.",
              type: "single",
              options: [
                "Sticky Topic Pill Navigation (Tech, Design, AI, Tutorials)",
                "Search Input with Instant Keyword Filtering",
                "Tag Cloud Sidebar with Post Counts",
                "Author / Publication Date Filter Dropdowns"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "blog_reading",
          name: "Article Reading Layout",
          icon: "article",
          description: "Typography, table of contents, code blocks, and reading progress.",
          questions: [
            {
              id: "blog_typography",
              label: "Typography & Content Layout",
              help: "Reading experience and layout width.",
              type: "single",
              options: [
                "Centered Single Column (max-w-3xl) with Generous Line-height",
                "Two-Column: Sticky Table of Contents Left, Article Body Center",
                "Editorial Split: Cover Image Left, Longform Story Right",
                "Dark Reader Theme with High-Contrast Monospace Accents"
              ],
              allowCustom: true
            },
            {
              id: "blog_features",
              label: "Interactive Reading Utilities",
              help: "Helpful reader utilities in the article view.",
              type: "single",
              options: [
                "Top Reading Progress Bar + Code Block One-Click Copy Buttons",
                "Social Share Floating Bar (Twitter, LinkedIn, Copy Link)",
                "Estimated Reading Time + Published Date + Author Avatar Pill",
                "Interactive Highlights & Footnotes Tooltips"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "blog_engagement",
          name: "Newsletter & Community",
          icon: "newsletter",
          description: "Newsletter capture, comments section, and related articles.",
          questions: [
            {
              id: "blog_newsletter_style",
              label: "Newsletter Signup Component",
              help: "Design and placement of email subscription prompt.",
              type: "single",
              options: [
                "Embedded Gradient Banner between articles and in footer",
                "Slide-up Minimalist Sticky Banner on 50% scroll",
                "Hero Card at top of feed with Subscriber Count Social Proof",
                "Inline CTA card within article markdown content"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    },
    {
      id: "social",
      name: "Social Media / Community App",
      badge: "Interactive",
      subtitle: "Activity feeds, user profiles, post creation, likes, comments, and real-time chat elements.",
      icon: "chat",
      sections: [
        {
          id: "social_timeline",
          name: "Feed & Timeline",
          icon: "timeline",
          description: "Chronological and algorithm feeds, stories bar, and post composer.",
          questions: [
            {
              id: "social_feed_layout",
              label: "Feed Architecture & Columns",
              help: "Layout structure of the main community hub.",
              type: "single",
              options: [
                "3-Column: Navigation Left, Main Feed Center, Trending/Suggested Right",
                "Centered Stream (Mobile-first focused feed)",
                "Two-Column Bento Grid with Live Community Chat sidebar",
                "Masonry Grid of Community Posts & Media"
              ],
              allowCustom: true
            },
            {
              id: "social_composer",
              label: "Post Creation & Composer",
              help: "How users author and publish new posts.",
              type: "single",
              options: [
                "Top Inline Card with Avatar, Textarea, Image/Poll Attachments",
                "Floating Action Button '+' opening Modal Composer",
                "Rich Text / Markdown Editor with Live Preview",
                "Quick Short-Post Bar with Emoji Reactions Picker"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "social_interactions",
          name: "Interactions & Comments",
          icon: "interactions",
          description: "Likes, reposts, bookmarks, threaded comments, and notifications.",
          questions: [
            {
              id: "social_action_buttons",
              label: "Post Engagement Actions",
              help: "Interactive triggers on each feed item.",
              type: "single",
              options: [
                "Like (Heart), Comment (Bubble), Repost/Share, Bookmark with Counters",
                "Upvote / Downvote Net Score System (Reddit style)",
                "Emoji Reaction Pill Bar (👍, ❤️, 🔥, 🚀, 💡)",
                "Clean Minimalist Icon Actions with Active State Transitions"
              ],
              allowCustom: true
            },
            {
              id: "social_comments_thread",
              label: "Comment System Architecture",
              help: "How replies and conversations are displayed.",
              type: "single",
              options: [
                "Expandable Nested Thread Tree with Collapse Toggles",
                "Bottom Slide-up Sheet / Drawer for Comments",
                "Inline Quick Reply Input Box under each post",
                "Live Real-time Comment Stream"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    },
    {
      id: "landing",
      name: "High-Converting Landing Page",
      badge: "Marketing",
      subtitle: "Hero section, feature grids, pricing tables, social proof testimonials, and FAQ accordion.",
      icon: "rocket",
      sections: [
        {
          id: "landing_hero",
          name: "Hero & Value Proposition",
          icon: "hero",
          description: "High-impact headline, subhead, conversion CTA, and product preview.",
          questions: [
            {
              id: "landing_hero_layout",
              label: "Hero Layout & Product Showcase",
              help: "Arrangement of headline and visual asset.",
              type: "single",
              options: [
                "Centered Dramatic Headline + Dual CTA + High-Res Dashboard Mockup",
                "Split 50/50: Pitch Left, Interactive Product Demo / Video Right",
                "Headline with Floating Animated Feature Cards and Glow Mesh",
                "Minimalist Typography-driven statement with Email Capture"
              ],
              allowCustom: true
            },
            {
              id: "landing_cta_style",
              label: "Primary Call to Action (CTA)",
              help: "Main conversion trigger for visitors.",
              type: "single",
              options: [
                "Direct 'Start Free Trial' (No Credit Card Required) + 'Book Demo'",
                "Inline Email Input + 'Get Early Access' Button",
                "Single Prominent Glow Button + Social Proof Avatars underneath",
                "Interactive 'Try Live Sandbox' Trigger"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "landing_features",
          name: "Feature Grid & Bento Highlights",
          icon: "features",
          description: "Key product benefits, bento grid layout, and icon cards.",
          questions: [
            {
              id: "landing_bento_layout",
              label: "Feature Section Layout",
              help: "How capabilities and value pillars are showcased.",
              type: "single",
              options: [
                "Bento Box Grid (Mixed 1x1, 2x1, 2x2 cards with visual UI mockups)",
                "3-Column Feature Cards with Gradient Icons and Micro-copy",
                "Alternating Zig-Zag Rows (Feature copy left, Screenshot right)",
                "Interactive Tabbed Feature Showcase with Live Preview Switching"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "landing_pricing_faq",
          name: "Pricing Matrix & FAQ",
          icon: "pricing",
          description: "Tiered pricing cards, billing toggle, social proof, and accordion FAQ.",
          questions: [
            {
              id: "landing_pricing_table",
              label: "Pricing Cards Architecture",
              help: "How subscription plans are presented.",
              type: "single",
              options: [
                "3 Tiers (Starter, Pro, Enterprise) with Monthly/Annual Toggle & Most Popular Highlight",
                "Single Flat-rate Simple Pricing Card with Feature Checklist",
                "Usage-based Interactive Slider Calculator",
                "Free Forever vs Premium Tier Comparison Table"
              ],
              allowCustom: true
            },
            {
              id: "landing_faq_accordion",
              label: "FAQ & Objection Handling",
              help: "Accordion design for answering common customer questions.",
              type: "single",
              options: [
                "Smooth Expandable Accordion with Plus/Minus SVG Icons",
                "2-Column Side-by-Side FAQ Grid with Category Headers",
                "Searchable Knowledge Base Accordion",
                "Clean Minimalist Bordered FAQ Cards"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    },
    {
      id: "custom",
      name: "Custom Web Application",
      badge: "Flexible",
      subtitle: "Define your own unique application architecture from scratch with custom parameters.",
      icon: "code",
      sections: [
        {
          id: "custom_shell",
          name: "App Shell & Layout Architecture",
          icon: "shell",
          description: "Core container, layout system, theme palette, and responsive shell.",
          questions: [
            {
              id: "custom_layout_type",
              label: "Master Layout Structure",
              help: "Overall viewport and container composition.",
              type: "single",
              options: [
                "Full-Screen Web App Shell (Fixed header/sidebar with scrollable main)",
                "Standard Responsive Document Container (Max-width centered)",
                "Split-Pane Workspace (Sidebar + Canvas + Inspector Panel)",
                "Multi-Step Sequential Wizard / Configurator Layout"
              ],
              allowCustom: true
            },
            {
              id: "custom_theme",
              label: "Theme & Design Language",
              help: "Color system, elevation, and aesthetic direction.",
              type: "single",
              options: [
                "Sleek Dark Slate (#080c14 background with glowing indigo accents)",
                "Clean Minimal Light (Crisp borders, white cards, subtle grays)",
                "Cyberpunk High-Contrast Dark with Neon Highlights",
                "Glassmorphism Translucent Blur with Subtle Gradients"
              ],
              allowCustom: true
            }
          ]
        },
        {
          id: "custom_logic",
          name: "Core Features & Dynamic Logic",
          icon: "logic",
          description: "Primary user loops, data persistence, and interactive flows.",
          questions: [
            {
              id: "custom_primary_action",
              label: "Primary User Action / Loop",
              help: "What the user spends most of their time doing.",
              type: "single",
              options: [
                "Form Input -> Computation / Transformation -> Export / Preview",
                "Browsing & Filtering structured records with live search",
                "Interactive Canvas / Drag-and-drop builder workspace",
                "Real-time Chat / Collaboration interface"
              ],
              allowCustom: true
            },
            {
              id: "custom_data_persistence",
              label: "Data Storage & State Needs",
              help: "How data is preserved between user sessions.",
              type: "single",
              options: [
                "Pure Offline: Browser LocalStorage / IndexedDB with JSON Export",
                "REST API Backend integration with async fetch endpoints",
                "Ephemeral In-Memory state (Session only, zero persistence)",
                "Realtime synchronization with WebSockets / Server-Sent Events"
              ],
              allowCustom: true
            }
          ]
        }
      ]
    }
  ],

  techStack: {
    cssFrameworks: [
      { id: "tailwind", name: "Tailwind CSS v3/v4 (CDN or npm)", desc: "Utility-first CSS framework with rapid custom styling" },
      { id: "bulma", name: "Bulma CSS Framework", desc: "Modern, clean flexbox framework with zero JS dependencies" },
      { id: "vanilla_css", name: "Vanilla CSS with Custom Properties", desc: "Hand-crafted CSS with modern custom variables" },
      { id: "bootstrap", name: "Bootstrap 5", desc: "Battle-tested responsive grid, components, and utilities" },
      { id: "daisyui", name: "Tailwind + DaisyUI Components", desc: "Semantic component classes built on top of Tailwind" }
    ],
    iconLibraries: [
      { id: "fontawesome", name: "FontAwesome 6 (CDN)", desc: "Comprehensive icon library with brand and UI icons" },
      { id: "lucide", name: "Lucide Icons / Lucide React", desc: "Clean, consistent modern SVG icon set" },
      { id: "remix", name: "Remix Icons", desc: "Open-source neutral-style icon library" },
      { id: "heroicons", name: "Heroicons", desc: "Beautiful hand-crafted SVG icons by Tailwind Labs" },
      { id: "material", name: "Material Design Icons", desc: "Google Material Design standard icon system" }
    ],
    httpClients: [
      { id: "fetch", name: "Vanilla JavaScript Fetch API", desc: "Native browser async/await fetch, zero bundle weight" },
      { id: "axios", name: "Axios HTTP Client", desc: "Feature-rich HTTP client with interceptors and timeouts" },
      { id: "zustand", name: "Zustand (for React) / LocalStorage API", desc: "Lightweight state store or native LocalStorage persistence" },
      { id: "tanstack", name: "TanStack Query / SWR", desc: "Powerful asynchronous state management & data fetching" },
      { id: "redux", name: "Redux Toolkit", desc: "Standard predictable state container for complex apps" }
    ],
    utilities: [
      { id: "canvas_confetti", name: "Canvas Confetti (for success states)", desc: "Delightful celebratory animations for conversions" },
      { id: "aos", name: "AOS / Tailwind Animations", desc: "Smooth scroll and entrance micro-animations" },
      { id: "sheetjs", name: "SheetJS / PapaParse (for data export)", desc: "Spreadsheet and CSV parsing and generation" },
      { id: "none", name: "None (Keep dependencies ultra-lean)", desc: "Zero external utility libraries, minimal bundle footprint" }
    ],
    reactivityEngines: [
      { id: "alpine", name: "Alpine.js 3", desc: "Rugged, minimal reactive framework declared in HTML" },
      { id: "vanilla", name: "Vanilla JavaScript (ES6+)", desc: "Pure DOM manipulation with modular JS functions" },
      { id: "react", name: "React 18 / 19", desc: "Component-based UI library with hooks and virtual DOM" },
      { id: "vue", name: "Vue 3", desc: "Progressive JavaScript framework with reactive refs" }
    ],
    targetAgents: [
      { id: "claude_code", name: "Claude Code (CLI / Terminal agent)", desc: "Anthropic's terminal agent for high-precision autonomous coding" },
      { id: "cursor", name: "Cursor IDE (Composer / AI Chat)", desc: "AI-first code editor with prompt composer" },
      { id: "lovable", name: "Lovable.dev (Full stack web builder)", desc: "Full-stack web application builder with instant preview" },
      { id: "antigravity", name: "Antigravity / V0 by Vercel", desc: "Google DeepMind's agentic coding platform & V0" },
      { id: "copilot", name: "GitHub Copilot Workspace", desc: "Task-centric environment for repository-wide features" }
    ]
  }
};
