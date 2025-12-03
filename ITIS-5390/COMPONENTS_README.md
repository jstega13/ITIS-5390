# Universal Components System with data-include

## Overview
The sidebar and top bar are now universal components that are automatically loaded on every page using the `data-include` attribute. This is a clean, elegant solution that eliminates code duplication.

## How It Works

### Component Files
- **`components/topbar.html`** - The top navigation bar with logo and user section
- **`components/sidebar.html`** - The left navigation rail with app icons
- **`scripts/include.js`** - JavaScript that loads components via data-include attributes

### Using Components in a Page

Simply add the `data-include` attribute pointing to the component file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
    <link rel="stylesheet" href="path/to/styles.css">
</head>
<body>
    <!-- Top Bar -->
    <header>
        <div data-include="components/topbar.html"></div>
    </header>

    <!-- Sidebar -->
    <nav>
        <div data-include="components/sidebar.html"></div>
    </nav>

    <!-- Your page content here -->

    <!-- Load include script -->
    <script src="path/to/scripts/include.js"></script>
</body>
</html>
```

### Path Examples

**From root directory** (`index.html`):
```html
<div data-include="components/topbar.html"></div>
<div data-include="components/sidebar.html"></div>
```

**From pages folder** (`pages/teams.html`):
```html
<div data-include="../components/topbar.html"></div>
<div data-include="../components/sidebar.html"></div>
```

**From nested folder** (`pages/Chats/chat.html`):
```html
<div data-include="../../components/topbar.html"></div>
<div data-include="../../components/sidebar.html"></div>
```

## Features

### Automatic Navigation
The `include.js` script automatically:
- ✅ Loads all components with `data-include` attributes
- ✅ Sets up navigation links with correct paths
- ✅ Highlights the active page in the sidebar
- ✅ Handles the settings button in the top bar
- ✅ Manages all sidebar navigation clicks

### Smart Path Resolution
The script detects your current location and adjusts all navigation paths automatically:
- Home page → `./pages/teams.html`
- Pages folder → `../pages/Chats/chat.html`
- Nested folders → `../../pages/settings/settings.html`

## Adding a New Page

1. Create your HTML file with data-include attributes:
```html
<!DOCTYPE html>
<html>
<head>
    <title>New Page</title>
    <link rel="stylesheet" href="../styles/styles.css">
</head>
<body>
    <header>
        <div data-include="../components/topbar.html"></div>
    </header>
    
    <nav>
        <div data-include="../components/sidebar.html"></div>
    </nav>

    <!-- Your content -->

    <script src="../scripts/include.js"></script>
</body>
</html>
```

2. That's it! The components will load automatically.

## Modifying Components

### To change the topbar or sidebar:
1. Edit `components/topbar.html` or `components/sidebar.html`
2. Changes automatically appear on ALL pages
3. No need to update individual pages

### To add a new navigation item:
1. Add the button to `components/sidebar.html`:
```html
<button class="nav-item" data-page="newpage" title="New Page">
    <i class="fas fa-icon"></i>
</button>
```

2. Update `scripts/include.js` in the `navigateToPage()` function:
```javascript
case 'newpage':
    targetPath = `${basePath}pages/newpage.html`;
    break;
```

3. Update `setActivePage()` to recognize the new page:
```javascript
else if (path.includes('/newpage.html') && page === 'newpage') {
    item.classList.add('active');
}
```

## Benefits

✅ **Clean HTML** - Just use `data-include="path/to/component.html"`
✅ **Single source of truth** - Edit once, updates everywhere
✅ **Automatic loading** - Components load on page load
✅ **Smart navigation** - Paths adjust based on location
✅ **Active states** - Current page highlighted automatically
✅ **Easy to understand** - Simple, declarative syntax

## Current Pages Using Components

- ✅ `index.html` (Home)
- ✅ `pages/teams.html` (Teams)
- 🔄 Can be added to: Chat, Settings, and any future pages

## Example: Complete Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - InnovateSync</title>
    <link rel="stylesheet" href="../styles/styles.css">
    <link rel="stylesheet" href="../styles/pages.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Top Bar -->
    <header>
        <div data-include="../components/topbar.html"></div>
    </header>

    <!-- Sidebar -->
    <nav>
        <div data-include="../components/sidebar.html"></div>
    </nav>

    <!-- Your page content -->
    <div class="main-container">
        <h1>Your Content Here</h1>
    </div>

    <!-- Scripts -->
    <script src="../scripts/include.js"></script>
    <script src="../scripts/your-page.js"></script>
</body>
</html>
```

## Technical Details

The `include.js` script:
1. Finds all elements with `data-include` attribute
2. Loads the HTML file via XMLHttpRequest
3. Injects the content into the element
4. Removes the `data-include` attribute
5. Sets up navigation and active states
6. Prevents duplicate event listeners with `data-nav-setup` flags

This approach is lightweight, fast, and doesn't require any build tools or frameworks!
