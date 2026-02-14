# Tele-Audiology Startup - Modular Monolith Architecture Rules

## Core Philosophy
This Next.js application follows a STRICT Modular Monolith architecture. The codebase is divided into isolated business domains called "features". Each feature is a self-contained mini-application.

## Critical: Nigerian Healthcare Context
- All monetary values use Nigerian Naira (₦)
- Payment integration MUST use Paystack or Flutterwave (Nigerian payment gateways)
- All timestamps should respect West Africa Time (WAT)
- Data handling must comply with Nigeria Data Protection Act (NDPA) 2023
- Include appropriate medical disclaimers for tele-consultation features

## Directory Structure (DO NOT DEVIATE)

```
src/
├── app/              # Next.js App Router (ROUTING ONLY - keep this dumb)
│   ├── layout.tsx    # Root layout with medical disclaimer
│   ├── page.tsx      # Homepage
│   ├── triage/       # Routes for hearing risk calculator
│   ├── shop/         # Routes for e-commerce
│   ├── consultation/ # Routes for booking consultations
│   └── checkout/     # Routes for payment
├── features/         # Modular Monolith core (isolated business domains)
│   ├── auth/         # User authentication and profiles
│   │   ├── components/
│   │   ├── actions/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── index.ts
│   ├── triage/       # Digital hearing-loss calculator & tele-consultation
│   │   ├── components/
│   │   ├── actions/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── index.ts
│   └── ecommerce/    # Ear care products store and cart
│       ├── components/
│       ├── actions/
│       ├── hooks/
│       ├── schemas/
│       └── index.ts
├── shared/           # Shared Kernel (global utilities and UI components)
│   ├── components/   # Generic UI components (Button, Input, Modal, etc.)
│   ├── lib/          # Shared utilities (formatters, validators, constants)
│   └── types/        # Shared TypeScript types
└── lib/              # External integrations
    ├── supabase.ts   # Supabase client configuration
    └── paystack.ts   # Paystack payment configuration
```

## Feature Module Rules

### Internal Structure (ALWAYS scaffold these when creating a feature):
```
/[feature-name]/
├── components/   # UI elements specific to THIS feature only
├── actions/      # Next.js Server Actions (Supabase database operations)
├── hooks/        # React hooks for client-side state/data fetching
├── schemas/      # Zod validation schemas
└── index.ts      # PUBLIC API - the ONLY entry point for other modules
```

### Module Boundaries (STRICTLY ENFORCE):

1. **Barrel Files Only**: Features can ONLY import from other features via their `index.ts` file
   - ✅ CORRECT: `import { getUser } from '@/features/auth'`
   - ❌ WRONG: `import { UserProfile } from '@/features/auth/components/UserProfile'`

2. **Database Isolation**: Features CANNOT directly query other features' tables
   - Cross-feature data requests must go through exported service functions
   - Example: If ecommerce needs user info, it calls `auth.getUserById()`, not direct Supabase query

3. **No Circular Dependencies**: If Feature A depends on Feature B, Feature B cannot depend on Feature A
   - Use dependency injection or event-based communication if needed

4. **Shared Code Goes to /shared**: If multiple features need the same component/utility, move it to `/shared`
   - Don't duplicate code across features

## Tech Stack Requirements

### Frontend:
- **Framework**: Next.js 14+ with App Router (NOT Pages Router)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod for validation
- **State**: React Context API for global state (keep it minimal)

### Backend:
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for product images)
- **API**: Next.js Server Actions (prefer over separate API routes)

### Payments:
- **Primary**: Paystack (Nigerian payment gateway)
- **Fallback**: Flutterwave
- **Currency**: Nigerian Naira (₦) only

### Deployment:
- **Hosting**: Vercel (free tier)
- **Database**: Supabase (free tier)

## Medical & Regulatory Requirements

### Legal Disclaimers (MUST include on every page):
```typescript
export const MEDICAL_DISCLAIMER = `
⚕️ IMPORTANT MEDICAL DISCLAIMER

This platform provides educational information and hearing health screening tools.
It is NOT a substitute for professional medical advice, diagnosis, or treatment.

• Always seek the advice of a qualified audiologist or physician
• Do not disregard professional medical advice based on information here
• This service does not diagnose conditions or prescribe treatments
• Operated by a registered Audiology student - not a licensed practitioner

If you think you may have a medical emergency, call your doctor immediately.
`
```

### Data Protection (NDPA 2023 Compliance):

1. **Encryption**: All user health data must be encrypted at rest and in transit
2. **Consent**: Obtain explicit consent before collecting personal/medical data
3. **Privacy Policy**: Provide clear privacy policy (link in footer)
4. **Data Deletion**: Allow users to delete their account and all associated data
5. **Data Minimization**: Only collect data that is necessary

### Scope Limitations (CRITICAL):
- ❌ NO diagnostic claims ("You have hearing loss")
- ❌ NO prescription of hearing aids or medical devices
- ❌ NO claims to replace in-person audiologist visits
- ✅ YES: Risk assessment, education, product sales, consultation booking
- ✅ YES: "Your results suggest you may benefit from a professional hearing test"

### Consultation Disclaimers:
Every consultation booking must include:
```
This virtual consultation is for educational and informational purposes only.
It is NOT a medical diagnosis. A proper hearing test requires in-person evaluation
by a licensed audiologist with calibrated equipment.
```

## Budget Constraints (₦100,000 Total)

### Service Selection Criteria:
When making architectural decisions, ALWAYS prioritize:

1. **Zero-cost services**: 
   - Supabase free tier (500MB database, 2GB file storage)
   - Vercel free tier (unlimited deployments, 100GB bandwidth)
   - Paystack (free, just 1.5% + ₦100 per transaction)

2. **Minimal dependencies**: 
   - Use built-in Next.js features over external libraries
   - Use shadcn/ui (copy-paste components) over heavy UI libraries
   - Avoid paid services, SaaS tools, or premium packages

3. **Inventory constraints**:
   - Start with 3-5 best-selling ear care products
   - Order minimum quantities
   - Prefer dropshipping if possible

4. **Marketing**:
   - Focus on organic social media (Instagram, Facebook, TikTok)
   - Use free design tools (Canva)
   - Leverage student networks and audiology communities

## Database Schema Guidelines

### Naming Conventions:
- Tables: `snake_case` (e.g., `hearing_assessments`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`)
- Always include: `id` (UUID), `created_at` (timestamp), `updated_at` (timestamp)

### Required Tables:

```sql
-- Auth Module
users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)

-- Triage Module
hearing_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  age INTEGER,
  noise_exposure_hours INTEGER,
  difficulty_hearing BOOLEAN,
  tinnitus BOOLEAN,
  family_history BOOLEAN,
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high')),
  created_at TIMESTAMP DEFAULT now()
)

consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
)

-- Ecommerce Module
products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)

cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT now()
)

orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT now()
)

order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
)
```

### Row Level Security (RLS):
ALWAYS enable RLS on all tables and create policies:
```sql
-- Example: Users can only read/update their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

## AI Assistant Behavior in Trae

When I ask you to build features, ALWAYS follow this workflow:

### 1. Start with Database Schema
```sql
-- Create migration file first
-- Example: 20240214_create_auth_tables.sql
```

### 2. Generate Feature Structure
Create all folders and files according to the modular structure:
```
src/features/[feature-name]/
├── components/
│   └── [Component].tsx
├── actions/
│   └── [feature]-actions.ts
├── hooks/
│   └── use[Feature].ts
├── schemas/
│   └── [feature]-schema.ts
└── index.ts
```

### 3. Implement with Type Safety
- Use TypeScript strict mode
- Define types for all function parameters and return values
- Use Zod schemas for runtime validation
- Generate TypeScript types from Zod schemas

### 4. Error Handling
ALL Server Actions must follow this pattern:
```typescript
'use server'

export async function createSomething(data: SomeSchema) {
  try {
    // Validate input
    const validated = someSchema.parse(data)
    
    // Perform action
    const result = await supabase.from('table').insert(validated)
    
    if (result.error) {
      return { success: false, error: result.error.message }
    }
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error in createSomething:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
```

### 5. Include Loading States
Every component that fetches data should have:
- Loading spinner/skeleton
- Error message display
- Empty state message

### 6. Accessibility
- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation works
- Test with screen readers when possible

### 7. Nigerian Context
- Format currency as ₦ (Naira symbol)
- Use DD/MM/YYYY date format
- Validate Nigerian phone numbers (+234 or 0)
- Show prices in Naira, no decimal places (₦1,500 not ₦1,500.00)

## Naming Conventions

### Files:
- Components: `PascalCase.tsx` (e.g., `RiskCalculator.tsx`)
- Actions: `kebab-case-actions.ts` (e.g., `auth-actions.ts`)
- Hooks: `useCamelCase.ts` (e.g., `useCart.ts`)
- Schemas: `kebab-case-schema.ts` (e.g., `product-schema.ts`)
- Pages: `kebab-case/page.tsx` (Next.js convention)

### Code:
- Components: `PascalCase` (e.g., `function RiskCalculator()`)
- Functions: `camelCase` (e.g., `getUserById()`)
- Variables: `camelCase` (e.g., `const totalPrice = 0`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `const MEDICAL_DISCLAIMER = ''`)
- Types/Interfaces: `PascalCase` (e.g., `interface User {}`)

### Database:
- Tables: `snake_case` (e.g., `hearing_assessments`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`)

### Environment Variables:
- `SCREAMING_SNAKE_CASE` (e.g., `NEXT_PUBLIC_SUPABASE_URL`)

## Code Quality Standards

### Every Pull Request / Code Change Should:
1. ✅ Follow the modular monolith structure
2. ✅ Include TypeScript types (no `any`)
3. ✅ Have proper error handling
4. ✅ Include loading/error states for async operations
5. ✅ Be responsive (mobile-first design)
6. ✅ Have meaningful variable names
7. ✅ Include comments for complex logic
8. ✅ Follow DRY principle (Don't Repeat Yourself)

### Do NOT:
1. ❌ Import across feature boundaries (except via index.ts)
2. ❌ Create circular dependencies
3. ❌ Put business logic in the app/ directory
4. ❌ Duplicate code (use shared/ folder)
5. ❌ Use `any` type in TypeScript
6. ❌ Commit secrets to Git (use .env files)
7. ❌ Create API routes unless necessary (use Server Actions)

## Example Prompts for Trae

### Good Prompts:
```
"Create the auth feature module with login, signup, and password reset.
Follow the modular structure in AGENTS.md. Include Zod validation and
proper error handling. Use Supabase Auth."

"Add a new product to the e-commerce feature. Update the ProductGrid
component to display it. Make sure to follow the existing patterns."

"Refactor the RiskCalculator component to show a progress bar as users
answer questions. Keep it in the triage feature module."
```

### Bad Prompts:
```
"Make a login page" (too vague, doesn't reference structure)

"Add authentication" (which feature? what structure?)

"Fix the bug" (what bug? where? be specific)
```

## Testing Strategy (When Budget Allows)

### Manual Testing Checklist:
- [ ] All forms validate correctly
- [ ] Error messages are clear and helpful
- [ ] Mobile responsiveness works
- [ ] Payment flow completes successfully (use test mode)
- [ ] Medical disclaimers are visible
- [ ] User data is private (test RLS)

### Future: Automated Testing
When the startup grows, add:
- Jest for unit tests
- Playwright for E2E tests
- Focus on critical paths: payment, auth, data privacy

## Deployment Checklist

Before deploying to production:

- [ ] Environment variables are set in Vercel
- [ ] Supabase RLS policies are enabled
- [ ] Medical disclaimer is on every page
- [ ] Privacy policy is published
- [ ] Paystack is in LIVE mode (not test)
- [ ] Google Analytics is configured (free tier)
- [ ] Error tracking is set up (Sentry free tier or similar)
- [ ] SSL certificate is active (Vercel provides free)
- [ ] Database backups are scheduled (Supabase automatic)

## Support & Resources

- **Trae Documentation**: https://docs.trae.ai
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Paystack API**: https://paystack.com/docs/api
- **shadcn/ui**: https://ui.shadcn.com
- **Zod**: https://zod.dev
- **Nigerian NDPA**: Search for latest compliance guidelines

## Version History

- **v1.0** (Feb 2025): Initial architecture for MVP launch
- Future versions will be documented here

---

**Remember**: This is a student-operated startup with limited budget. Every architectural 
decision should prioritize: FREE services, SIMPLE solutions, and SAFE operations.

Do not over-engineer. Ship fast, iterate based on user feedback.
