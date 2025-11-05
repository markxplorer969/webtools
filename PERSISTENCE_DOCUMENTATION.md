# State Persistence Global Documentation

## Overview

State persistence global telah diimplementasikan menggunakan custom hook `usePersistentState` yang secara otomatis menyimpan dan memulihkan state dari localStorage.

## Arsitektur

### 1. usePersistentState Hook

**Location:** `src/lib/hooks/usePersistentState.ts`

**Features:**
- ✅ TypeScript generics untuk type safety
- ✅ Lazy initialization untuk performa optimal
- ✅ Automatic save ke localStorage saat state berubah
- ✅ Error handling untuk localStorage failures
- ✅ Server-side rendering (SSR) compatible

**Usage:**
```typescript
const [value, setValue] = usePersistentState<string>('key', 'defaultValue');
```

### 2. Tool-Specific Hooks

**Location:** `src/lib/hooks/useToolState.ts`

**Features:**
- ✅ `useToolState` - State management dengan reset function
- ✅ `useToolStateManager` - Batch operations untuk tool management
- ✅ Export/Import functionality untuk data backup

## Implementasi pada Tools

### Facebook UID Checker

**Persistent States:**
- `fb_rawInput` - Input UID dari user
- `fb_speed` - Kecepatan processing
- `fb_liveList` - Daftar UID yang live
- `fb_deadList` - Daftar UID yang dead
- `fb_errorList` - Daftar UID yang error
- `fb_duplicateList` - Daftar UID yang duplikat
- `fb_counters` - Statistik pemeriksaan

### Multi-2FA Authenticator

**Persistent States:**
- `2fa_rawInput` - Input secret keys dari user
- `2fa_codes` - Generated 2FA codes

## Key Benefits

### 1. DRY Principle (Don't Repeat Yourself)
- Tidak ada duplikasi kode untuk localStorage management
- Single source of truth untuk persistence logic
- Mudah maintenance dan debugging

### 2. Automatic Persistence
- State otomatis tersimpan tanpa manual intervention
- Data dipulihkan saat page refresh
- No boilerplate code required

### 3. Type Safety
- TypeScript generics ensure type correctness
- Compile-time error checking
- Better IDE support dengan autocomplete

### 4. Performance Optimized
- Lazy initialization mencegah unnecessary renders
- Efficient debounced saves
- Minimal memory footprint

## Advanced Features

### Utility Functions

```typescript
// Clear specific persistent state
clearPersistentState('fb_rawInput');

// Clear all states with prefix
clearPersistentStatesByPrefix('fb_');

// Get all persistent state keys
const keys = getPersistentStateKeys();
```

### Tool State Manager

```typescript
const { clearAllStates, exportData, importData } = useToolStateManager('facebook');

// Clear all Facebook tool states
clearAllStates();

// Export tool data as JSON
const jsonData = exportData();

// Import tool data from JSON
const success = importData(jsonData);
```

## Error Handling

Hook memiliki comprehensive error handling:
- SSR compatibility checks
- localStorage quota exceeded handling
- JSON parsing error recovery
- Graceful fallbacks untuk privacy mode

## Best Practices

1. **Use Descriptive Keys**: Gunakan prefix yang jelas (contoh: `fb_`, `2fa_`)
2. **Keep Default Values Simple**: Default values harus serializable
3. **Avoid Large Objects**: localStorage memiliki size limitations
4. **Use Type Annotations**: Manfaatkan TypeScript generics
5. **Handle Sensitive Data**: Jangan simpan sensitive information tanpa encryption

## Migration Guide

Untuk menambahkan persistence ke tool baru:

1. Import hook:
```typescript
import { usePersistentState } from '@/lib/hooks';
```

2. Replace useState:
```typescript
// Before
const [data, setData] = useState([]);

// After
const [data, setData] = usePersistentState('tool_data', []);
```

3. Handle clear/reset:
```typescript
const handleClear = () => {
  setData([]); // Otomatis tersimpan ke localStorage
};
```

## Testing

Persistence functionality dapat di-test dengan:
1. Input data ke tool
2. Refresh browser page
3. Verifikasi data masih ada
4. Test clear/reset functionality
5. Test export/import jika menggunakan tool state manager

## Conclusion

Implementasi ini memberikan state persistence global yang robust, type-safe, dan mudah digunakan tanpa duplikasi kode. Semua tools sekarang secara otomatis mengingat state mereka antar sessions.