# PromoPers Website - URL Structure

## Main Pages
- `/` - Home page
- `/about` - About Us page
- `/references` - References listing (with pagination)
- `/contact` - Contact page
- `/blog` - Blog listing page

## Client Reference Pages (Unique URLs)
Each client has its own dedicated page:

1. **Coca-Cola**
   - URL: `/references/coca-cola`
   - Description: Experiential activations across Switzerland

2. **Samsung**
   - URL: `/references/samsung`
   - Description: Retail marketing partnership

3. **JBL**
   - URL: `/references/jbl`
   - Description: Brand experiences and sales promotion

4. **Arlo**
   - URL: `/references/arlo`
   - Description: Home security product marketing

5. **Asus**
   - URL: `/references/asus`
   - Description: Consumer electronics retail partnership

## Blog Article Pages (Unique URLs)
Each blog article has its own dedicated page:

1. **Peace Tea POS Activation 2025**
   - URL: `/blog/peace-tea-pos-activation-2025`
   - Category: POS Activation
   - Date: 01-Aug-2025
   - Author: Lukas Berger

2. **JBL Popup Geneva Airport**
   - URL: `/blog/jbl-popup-geneva-airport`
   - Category: Events
   - Date: 15-Jul-2025
   - Author: Lukas Berger

3. **Samsung Galaxy Launch** (placeholder)
   - URL: `/blog/samsung-galaxy-launch`
   - Category: Merchandising
   - Date: 11-Jul-2025
   - Note: Content to be added

## URL Features

### Static Generation
- All pages use Next.js `generateStaticParams()` for static site generation
- Each page has unique metadata for SEO optimization
- URLs are clean and SEO-friendly

### Dynamic Routing
- Client pages: `/references/[slug]`
- Blog articles: `/blog/[slug]`

### Navigation Flow
1. References page → Click client card → Individual client page
2. Client page → Click "Read More" on related references → Blog article page
3. Blog article page → Click related blogs → Other blog articles

## Server Configuration
- Development server runs on port 3002
- Access at: `http://localhost:3002`

## Examples
```
http://localhost:3002/
http://localhost:3002/references
http://localhost:3002/references/coca-cola
http://localhost:3002/references/samsung
http://localhost:3002/blog/peace-tea-pos-activation-2025
http://localhost:3002/blog/jbl-popup-geneva-airport
```

