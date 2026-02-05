<<<<<<< HEAD
# landscap
=======
# Customscape AI - Landscape Design Platform

A modern web application that uses AI to help users design beautiful gardens and landscapes. Upload yard images, apply auto-masking, and generate AI-powered landscape designs with various garden styles.

## Features

- **Authentication**: Secure sign-in/sign-up with email, Google, Facebook, and Apple OAuth
- **Auto-Masking**: Automatically mask yard images for landscape design processing
- **AI Image Generation**: Generate multiple landscape design variations using AI
- **Garden Styles**: Choose from various landscape themes and styles
- **Google Street View Integration**: Use Google Street View images for landscape design
- **Subscription Management**: Multiple subscription tiers (Base, Personalized, Pro plans)
- **Favorites**: Save and manage favorite landscape designs
- **User Profile**: Manage user profile and settings

## Tech Stack

- **Framework**: Next.js 15.2.6 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **UI Components**: PrimeReact, PrimeFlex, PrimeIcons
- **Authentication & Backend**: AWS Amplify (Cognito, AppSync)
- **Form Management**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Image Carousel**: Swiper
- **Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **pnpm**: Version 8.x or higher ([Installation guide](https://pnpm.io/installation))
- **AWS Account**: For Amplify backend services (if setting up from scratch)
- **Git**: For version control

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd landscape-ai-web
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=<your-api-url>

# API Base URLs
NEXT_PUBLIC_API_BASE_URL=<your-api-base-url>
NEXT_PUBLIC_PRESIGNED_BASE_URL=<your-presigned-url-base>

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>

# S3 Configuration
NEXT_PUBLIC_S3_BASE_URL=<your-s3-bucket-url>
```

**Note**: Contact your team lead or check the project documentation for the actual values of these environment variables.

### 4. AWS Amplify Configuration

The project uses AWS Amplify for authentication and data management. The `amplify_outputs.json` file should already be configured. If you need to set up Amplify from scratch:

```bash
# Install Amplify CLI (if not already installed)
npm install -g @aws-amplify/cli

# Configure Amplify backend
npx ampx sandbox
```

### 5. Run the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `pnpm dev` - Start the development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server (run after `pnpm build`)
- `pnpm lint` - Run ESLint to check for code issues
- `pnpm lint:fix` - Automatically fix ESLint issues
- `pnpm format` - Format code using Prettier

## Project Structure

```
landscape-ai-web/
├── amplify/                 # AWS Amplify backend configuration
│   ├── auth/               # Authentication resources
│   ├── data/               # Data/GraphQL resources
│   └── backend.ts          # Backend definition
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── authentication/ # Auth pages (signin, signup)
│   │   ├── dashboard/      # Dashboard pages
│   │   └── ...
│   ├── components/         # React components
│   │   ├── Dashboard/      # Dashboard-specific components
│   │   ├── Signin/         # Authentication components
│   │   └── ...
│   ├── context/            # React context providers
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── schema/             # Form validation schemas (Zod)
│   └── config/             # Configuration files
├── amplify_outputs.json    # Amplify configuration (generated)
├── next.config.ts          # Next.js configuration
└── package.json            # Dependencies and scripts
```

## Key Features of the webapp

### Authentication
- Email/password authentication via AWS Cognito
- Social login (Google, Facebook, Apple)
- Password reset and verification flows

### Auto-Masking
- Upload yard images or use Google Street View
- Automatic background masking for landscape processing
- Real-time status polling for mask generation

### AI Image Generation
- Generate multiple landscape design variations
- Select from various garden styles
- View before/after comparisons

### Dashboard
- Home: Upload images and start design process
- AutoMask: Manage and edit masks
- Generate Images: View and manage AI-generated designs
- Garden Styles: Browse available landscape themes
- Favorites: Save and manage favorite designs
- Subscription: Manage subscription plans
- Help: Access help center

## Development Guidelines

### Code Style
- The project uses ESLint and Prettier for code formatting
- Run `pnpm lint:fix` before committing
- Use TypeScript for type safety

### Component Structure
- Components are organized by feature
- Use React hooks for state management
- Context API for global state (ImageContext, UserContext, etc.)

### API Calls
- All API calls are centralized in the `src/services/` directory
- Use the axios instance from `src/utils/axios.ts`
- Handle errors appropriately with toast notifications

## Troubleshooting

### Common Issues

**Issue**: `pnpm: command not found`
- **Solution**: Install pnpm globally: `npm install -g pnpm`

**Issue**: Amplify authentication not working
- **Solution**: Verify `amplify_outputs.json` exists and contains correct configuration

**Issue**: Environment variables not loading
- **Solution**: Ensure `.env.local` is in the root directory and restart the dev server

**Issue**: Google Maps not loading
- **Solution**: Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
>>>>>>> a22303c (Initial commit)
