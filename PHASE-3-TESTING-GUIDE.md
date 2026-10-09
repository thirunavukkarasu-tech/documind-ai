# Phase 3 Testing Guide: Document Upload & Management

## Setup for Testing

### 1. Start the Services
```bash
# Terminal 1: MongoDB
docker-compose up -d

# Terminal 2: Backend
cd server
npm install
npm run dev

# Terminal 3: Frontend
cd client
npm install
npm run dev
```

Access the application at: http://localhost:5173

### 2. Create Test Users
Register two different users to test ownership enforcement:
- **User A:** john@example.com / Password123!
- **User B:** jane@example.com / Password123!

---

## 20 Test Scenarios

### Authentication & Authorization Tests

#### Test 1: Unauthenticated user cannot access /documents
**Steps:**
1. Open http://localhost:5173/documents in a new incognito window
2. Observe behavior

**Expected Result:**
- User is redirected to /login page
- Cannot view documents page without authentication

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 2: Authenticated user can access /documents
**Steps:**
1. Login as User A
2. Verify page loads

**Expected Result:**
- /documents page loads successfully
- User greeting shows "Welcome, John!"
- Document list shows (empty or with documents)

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 3: User cannot access other user's documents
**Steps:**
1. Login as User A, upload a document
2. Note the document count
3. Login as User B (in incognito window)
4. Check User B's document count

**Expected Result:**
- User B's documents page is empty
- User B cannot see User A's documents
- Document list shows "No documents yet"

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 4: User cannot delete other user's documents
**Steps:**
1. Get document ID from User A's upload
2. Login as User B
3. Try to delete User A's document via API:
   ```bash
   curl -X DELETE http://localhost:5000/api/documents/{doc_id} \
     -H "Authorization: Bearer {user_b_token}"
   ```

**Expected Result:**
- Request returns 404 or 403
- User B cannot delete User A's document
- User A still has the document

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 5: User cannot rename other user's documents
**Steps:**
1. Get document ID from User A's upload
2. Login as User B
3. Try to rename User A's document via API:
   ```bash
   curl -X PATCH http://localhost:5000/api/documents/{doc_id} \
     -H "Authorization: Bearer {user_b_token}" \
     -H "Content-Type: application/json" \
     -d '{"name": "hacked.pdf"}'
   ```

**Expected Result:**
- Request returns 404 or 403
- User B cannot rename User A's document
- Original name unchanged in User A's account

**Status:** ✅ PASS / ❌ FAIL

---

### Upload Functionality Tests

#### Test 6: Upload PDF file successfully
**Steps:**
1. Login as User A
2. Click "📤 Upload Document" button
3. Select a PDF file (or create test file)
4. Click Upload

**Expected Result:**
- File uploads successfully
- Document appears in list
- Status shows "UPLOADED"
- File size displays correctly
- Created date shows today

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 7: Upload TXT file successfully
**Steps:**
1. Login as User A
2. Click "📤 Upload Document" button
3. Select or create a .txt file
4. Click Upload

**Expected Result:**
- File uploads successfully
- Document appears in list
- File type shows as "plain"
- Icon shows 📝 for text files

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 8: Upload DOCX file successfully
**Steps:**
1. Login as User A
2. Click "📤 Upload Document" button
3. Select or create a .docx file
4. Click Upload

**Expected Result:**
- File uploads successfully
- Document appears in list
- File type shows as "vnd.openxmlformats-officedocument.wordprocessingml.document"
- Icon shows 📑 for Word documents

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 9: Reject unsupported file types
**Steps:**
1. Login as User A
2. Click "📤 Upload Document" button
3. Try to select .exe, .jpg, .png, or other unsupported file
4. Observe behavior

**Expected Result:**
- File input only accepts: .pdf, .txt, .docx
- Cannot select unsupported files
- If uploaded via API: error response with "unsupported file type" message

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 10: Reject files exceeding 20MB
**Steps:**
1. Create a file larger than 20MB
2. Try to upload via modal
3. Try to upload via API with curl

**Expected Result:**
- Modal shows: "max 20 MB"
- Cannot upload via form
- API returns 400/413 error: "File too large"
- Error message: "File size must not exceed 20 MB"

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 11: Document status is UPLOADED immediately after upload
**Steps:**
1. Upload any document
2. Check status badge in table

**Expected Result:**
- Status badge shows "UPLOADED" (blue background)
- Status color uses getStatusColor() for UPLOADED
- Database record shows status: 'UPLOADED'

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 12: Uploaded file is stored in uploads/{userId}/ directory
**Steps:**
1. Login and get your user ID from JWT or user context
2. Upload a document
3. Check server file system:
   ```bash
   ls -la server/uploads/{userId}/
   ```

**Expected Result:**
- Directory exists: server/uploads/{userId}/
- File exists with format: {userId}_{timestamp}.{extension}
- File size matches uploaded file
- Example: server/uploads/user123/user123_1696679200000.pdf

**Status:** ✅ PASS / ❌ FAIL

---

### List & Search Tests

#### Test 13: List documents with pagination (10/25/50 per page)
**Steps:**
1. Upload 15+ documents
2. Default list shows 10 items
3. Click "25" in Items per page
4. Verify list shows up to 25 items
5. Click "50" and verify

**Expected Result:**
- Default pagination: 10 items/page
- Can select 25 items/page
- Can select 50 items/page
- Pagination controls work: Previous/Next/page numbers
- Item count displays: "Showing X of Y documents"

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 14: Search documents by name (text search)
**Steps:**
1. Upload documents with names:
   - "Invoice_January.pdf"
   - "Invoice_February.pdf"
   - "Report_Q1.docx"
2. Type "Invoice" in search box
3. Observe results

**Expected Result:**
- Only documents with "Invoice" in name show
- "Report_Q1.docx" is hidden
- Search is case-insensitive
- Page resets to 1 when searching
- Clear Filters button appears

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 15: Filter documents by status
**Steps:**
1. Upload a document (status: UPLOADED)
2. Change one document status to READY via backend
3. Use Status filter dropdown

**Expected Result:**
- "All Statuses" shows all documents
- "Uploaded" filter shows only UPLOADED documents
- "Processing" filter shows PROCESSING documents
- "Ready" filter shows READY documents
- "Failed" filter shows FAILED documents
- Filter updates list immediately

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 16: Filter documents by file type
**Steps:**
1. Upload documents of different types:
   - test.pdf
   - note.txt
   - document.docx
2. Use File Type filter dropdown

**Expected Result:**
- "All Types" shows all documents
- "PDF" filter shows only .pdf files
- "TXT" filter shows only .txt files
- "DOCX" filter shows only .docx files
- Filter updates list immediately
- Can combine with status filter

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 17: Sort documents by createdAt/originalName/size
**Steps:**
1. Upload documents with different names and sizes
2. Click Sort By dropdown

**Expected Result:**
- Default: "Date Created" (descending, newest first)
- "Name" sorts alphabetically (A-Z by default)
- "File Size" sorts by size (smallest first by default)
- Sort order button (⬇️/⬆️) toggles between asc/desc
- List updates immediately when sort changes

**Status:** ✅ PASS / ❌ FAIL

---

### Rename & Delete Tests

#### Test 18: Rename document to new name (1-255 characters)
**Steps:**
1. Upload a document
2. Click the ✏️ edit button
3. Change name to "new_name.pdf"
4. Click Save

**Expected Result:**
- Name changes in table
- Validates: 1-255 characters
- Rejects: empty names
- Shows error for names >255 chars
- Can include spaces and special chars (except path separators)
- Database updates immediately

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 19: Delete document and remove physical file
**Steps:**
1. Upload a document and note its name
2. Click 🗑️ delete button
3. Confirm deletion in modal
4. Check server filesystem:
   ```bash
   ls -la server/uploads/{userId}/{stored_name}
   ```

**Expected Result:**
- Confirmation modal appears
- Warning message: "This action cannot be undone"
- After confirming: document removed from list
- Database record deleted
- Physical file deleted from disk
- File no longer exists in server/uploads/{userId}/

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 20: Download document with correct content
**Steps:**
1. Upload a file (e.g., test.pdf)
2. Click ⬇️ download button
3. Check downloaded file

**Expected Result:**
- File downloads with original name
- File size matches original
- File content is identical (checksum match)
- Content-Type header is correct:
  - application/pdf for PDF
  - text/plain for TXT
  - application/vnd.openxmlformats... for DOCX
- Browser shows "Saving test.pdf" or similar

**Status:** ✅ PASS / ❌ FAIL

---

## Advanced Test Scenarios

### Edge Cases

#### Test 21: Upload empty file
**Steps:**
1. Create empty file (0 bytes)
2. Try to upload

**Expected Result:**
- Empty file uploads successfully
- File size shows as "0 B"
- Can be downloaded (though empty)

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 22: Upload file with special characters in name
**Steps:**
1. Upload file: "Invoice (2024) - Jan & Feb.pdf"
2. Check table display

**Expected Result:**
- Displays with original name
- Stored filename is safe: user_timestamp.pdf
- Physical file is safe (no special chars in filename)
- Can be renamed and downloaded

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 23: Rapid file uploads (concurrent)
**Steps:**
1. Upload 3 files quickly without waiting for completion
2. Observe

**Expected Result:**
- All files queue and upload
- Each gets unique filename (different timestamp)
- No file overwrites
- All appear in list

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 24: Search is case-insensitive
**Steps:**
1. Upload "Invoice.pdf"
2. Search for "invoice"
3. Search for "INVOICE"

**Expected Result:**
- All searches find the document
- Case doesn't matter
- Text search is flexible

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 25: Clear Filters button resets all filters
**Steps:**
1. Apply search: "Invoice"
2. Apply status filter: "READY"
3. Apply type filter: "PDF"
4. Click "Clear Filters"

**Expected Result:**
- All filters reset
- Shows all documents
- Button disappears (only shows when filters active)
- Page resets to 1

**Status:** ✅ PASS / ❌ FAIL

---

## Performance Tests

#### Test 26: List 100 documents
**Steps:**
1. Upload 100 documents
2. List with 50 items/page

**Expected Result:**
- Page 1 loads quickly (<2 seconds)
- Pagination works smoothly
- No N+1 queries (single query with pagination)
- Database indexes are being used

**Status:** ✅ PASS / ❌ FAIL

---

## UI/UX Tests

#### Test 27: Loading states work correctly
**Steps:**
1. Upload a file and observe loading state
2. List documents and observe spinner

**Expected Result:**
- Upload button shows "Uploading..." during upload
- List shows spinner during fetch
- All buttons disabled during operations
- Error messages display clearly

**Status:** ✅ PASS / ❌ FAIL

---

#### Test 28: Responsive design on mobile
**Steps:**
1. Open app on mobile device or use browser mobile view
2. Try uploading, listing, searching

**Expected Result:**
- Layout is responsive
- All features work on mobile
- Table doesn't overflow
- Buttons are touchable size
- Modal works on small screens

**Status:** ✅ PASS / ❌ FAIL

---

## Summary

Total Tests: 28
- Core Tests (20): ___/20 passed
- Advanced Tests (5): ___/5 passed  
- Performance Tests (1): ___/1 passed
- UI/UX Tests (2): ___/2 passed

**Overall Status:** ___% Complete

---

## Running API Tests with cURL

### Setup Auth Token
```bash
# Login
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}' \
  -c cookies.txt)

TOKEN=$(echo $RESPONSE | jq -r '.data.accessToken')
USER_ID=$(echo $RESPONSE | jq -r '.data.user.id')
```

### Upload Test
```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.pdf"
```

### List Test
```bash
curl -X GET "http://localhost:5000/api/documents?page=1&limit=10&search=test&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Document
```bash
curl -X GET http://localhost:5000/api/documents/{doc_id} \
  -H "Authorization: Bearer $TOKEN"
```

### Rename Document
```bash
curl -X PATCH http://localhost:5000/api/documents/{doc_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"new_name.pdf"}'
```

### Delete Document
```bash
curl -X DELETE http://localhost:5000/api/documents/{doc_id} \
  -H "Authorization: Bearer $TOKEN"
```

### Download Document
```bash
curl -X GET http://localhost:5000/api/documents/{doc_id}/download \
  -H "Authorization: Bearer $TOKEN" \
  -o downloaded_file.pdf
```

---

**Last Updated:** October 7, 2026  
**Phase:** 3 - Document Upload & Management  
**Status:** ✅ Implementation Complete
