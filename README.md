# ShopMax - Multi-Vendor eCommerce Platform

## Project Structure

```
shop-full/
├── frontend/                    # React 18 + TypeScript + Vite
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   └── icons/             # PWA icons
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # Base UI components (Shadcn)
│   │   │   ├── layout/        # Layout components
│   │   │   ├── common/        # Common components
│   │   │   └── forms/         # Form components
│   │   ├── pages/            # Page components
│   │   │   ├── customer/      # Customer pages
│   │   │   ├── vendor/        # Vendor dashboard pages
│   │   │   └── admin/         # Admin dashboard pages
│   │   ├── store/            # Redux store
│   │   │   ├── slices/       # Redux slices
│   │   │   └── index.ts
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   │   ├── api/          # Axios configuration
│   │   │   └── endpoints/    # API endpoints
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── lib/              # Library configurations
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/                    # Python FastAPI
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── v1/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── vendors/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── payments/
│   │   │   │   ├── cart/
│   │   │   │   ├── wishlist/
│   │   │   │   ├── reviews/
│   │   │   │   ├── notifications/
│   │   │   │   ├── analytics/
│   │   │   │   └── subscriptions/
│   │   │   └── websocket/
│   │   ├── core/             # Core configurations
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   ├── database.py
│   │   │   └── cache.py
│   │   ├── models/           # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── vendor.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   ├── payment.py
│   │   │   └── ...
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   │   ├── ai/
│   │   │   ├── payments/
│   │   │   └── notifications/
│   │   ├── tasks/            # Celery tasks
│   │   └── utils/            # Utility functions
│   ├── alembic/              # Database migrations
│   ├── .env.example
│   ├── requirements.txt
│   ├── Dockerfile
│   └── main.py
│
├── docker-compose.yml
├── deployment/
│   ├── render.yaml
│   ├── railway.json
│   └── vercel.json
│
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── SECURITY.md
```

## Technology Stack

### Frontend
- React 18.2+
- TypeScript 5+
- Vite 5+
- TailwindCSS 3.4+
- Shadcn UI
- Redux Toolkit
- React Query (TanStack Query)
- React Router v6
- Axios
- Framer Motion
- React Hook Form
- Zod
- Stripe.js

### Backend
- Python 3.11+
- FastAPI
- PostgreSQL (Supabase/ElephantSQL)
- SQLAlchemy 2.0+
- Alembic
- Redis (Upstash/Redis Cloud)
- Celery
- WebSocket (FastAPI)
- Elasticsearch (Elastic Cloud)
- MinIO / Cloudinary

### Payment Gateways
- **International**: Stripe, PayPal
- **Bangladesh**: bKash, Nagad, Rocket/DBBL

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Redis

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Environment Variables

See `.env.example` files in frontend and backend directories.

## License
MIT
