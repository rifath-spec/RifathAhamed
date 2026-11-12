import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_IS_ADMIN_MODE,
  DUMMY_EDIT_MODAL_MESSAGE,
  formatEditModalTitle,
  isOwnerEditMode,
  extractGoogleDriveFileId,
  isValidImageUrl,
  isValidDocumentUrl,
  normalizeImageUrl,
  normalizeDocumentUrl,
  resolveProjectScreenshots,
  getPublishedCertificates,
  isRestrictedAcademicDocument,
  requestPopupOpen,
  POPUP_AUTO_CLOSE_MS,
} from './portfolioLogic';

test('formatEditModalTitle and DUMMY_EDIT_MODAL_MESSAGE match specification', () => {
  assert.equal(DEFAULT_IS_ADMIN_MODE, true);
  assert.equal(formatEditModalTitle('About'), 'Edit About');
  assert.equal(formatEditModalTitle('Cover image'), 'Edit Cover image');
  assert.equal(
    DUMMY_EDIT_MODAL_MESSAGE,
    'Editing will be available after the admin backend is connected'
  );
});

test('isOwnerEditMode returns false for public URLs and true only when ?edit=true is present', () => {
  assert.equal(isOwnerEditMode(''), false);
  assert.equal(isOwnerEditMode('?ref=linkedin'), false);
  assert.equal(isOwnerEditMode('?edit=false'), false);
  assert.equal(isOwnerEditMode('?edit=true'), true);
  assert.equal(isOwnerEditMode('?utm_source=cv&edit=true'), true);
});

test('normalizeImageUrl and extractGoogleDriveFileId convert Google Drive share URLs to direct image links', () => {
  assert.equal(
    extractGoogleDriveFileId('https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing'),
    '1AbCdEfGhIjKlMnOpQrStUvWxYz'
  );
  assert.equal(
    normalizeImageUrl('/assets/aistudio/Untitled_9d626b95.png'),
    '/assets/aistudio/Untitled_9d626b95.png'
  );
  assert.equal(
    normalizeImageUrl('https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing'),
    'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz'
  );
  assert.equal(
    normalizeImageUrl('https://drive.google.com/open?id=1AbCdEfGhIjKlMnOpQrStUvWxYz'),
    'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz'
  );
});

test('normalizeDocumentUrl converts Google Drive share URLs to direct download links and preserves PDF paths', () => {
  assert.equal(normalizeDocumentUrl('/assets/resume.pdf'), '/assets/resume.pdf');
  assert.equal(
    normalizeDocumentUrl('https://drive.google.com/file/d/1DocFileId999/view?usp=sharing'),
    'https://drive.google.com/uc?export=download&id=1DocFileId999'
  );
  assert.equal(isValidDocumentUrl('/assets/resume.pdf'), true);
  assert.equal(isValidDocumentUrl('https://drive.google.com/file/d/1DocFileId999/view'), true);
  assert.equal(isValidDocumentUrl('javascript:alert(1)'), false);
});

test('isValidImageUrl accepts valid HTTPS, base64 data images, and relative asset paths and rejects empty or insecure URLs', () => {
  assert.equal(isValidImageUrl(''), false);
  assert.equal(isValidImageUrl('   '), false);
  assert.equal(isValidImageUrl(null), false);
  assert.equal(isValidImageUrl('http://insecure.example.com/photo.jpg'), false);
  assert.equal(isValidImageUrl('javascript:alert(1)'), false);
  assert.equal(isValidImageUrl('https://example.com/profile.jpg'), true);
  assert.equal(isValidImageUrl('assets/profile.jpg'), true);
  assert.equal(isValidImageUrl('/assets/certificates/aat.png'), true);
  assert.equal(isValidImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'), true);
});

test('resolveProjectScreenshots handles empty strings, single URLs, and multiple screenshot arrays', () => {
  assert.deepEqual(resolveProjectScreenshots(''), []);
  assert.deepEqual(resolveProjectScreenshots('https://example.com/school-1.png'), [
    'https://example.com/school-1.png',
  ]);
  assert.deepEqual(
    resolveProjectScreenshots([
      'https://example.com/screen1.png',
      '',
      'http://insecure.com/bad.png',
      'assets/screen2.png',
    ]),
    ['https://example.com/screen1.png', 'assets/screen2.png']
  );
});

test('getPublishedCertificates hides empty certificate entries and keeps valid certificates', () => {
  const defaultEmptyConfig = [
    {
      title: '',
      issuer: '',
      date: '',
      imageUrl: '',
      verificationUrl: '',
    },
  ];
  assert.deepEqual(getPublishedCertificates(defaultEmptyConfig), []);

  const mixedEntries = [
    { title: '   ', issuer: 'None', date: '2025', imageUrl: '' },
    {
      title: 'Certificate in Computer Applications',
      issuer: 'Verified Institute',
      date: '2024',
      imageUrl: 'https://example.com/cert.png',
      verificationUrl: 'https://example.com/verify/123',
    },
    {
      title: 'Scanned Academic Transcript',
      issuer: 'University',
      date: '2025',
      imageUrl: 'https://example.com/transcript.png',
    },
  ];

  const published = getPublishedCertificates(mixedEntries);
  assert.equal(published.length, 1);
  assert.equal(published[0].title, 'Certificate in Computer Applications');
  assert.equal(published[0].issuer, 'Verified Institute');
  assert.equal(published[0].imageUrl, 'https://example.com/cert.png');
  assert.equal(published[0].verificationUrl, 'https://example.com/verify/123');
});

test('isRestrictedAcademicDocument flags degree certificate photos and scanned transcripts', () => {
  assert.equal(isRestrictedAcademicDocument('Degree Certificate Photo'), true);
  assert.equal(isRestrictedAcademicDocument('Scanned Academic Transcript'), true);
  assert.equal(isRestrictedAcademicDocument('AAT Sri Lanka Passed Finalist'), false);
});

test('requestPopupOpen prevents multiple simultaneous popups and uses 4s auto-close duration', () => {
  assert.equal(POPUP_AUTO_CLOSE_MS, 4000);
  assert.deepEqual(requestPopupOpen(false), { shouldOpen: true, nextState: true });
  assert.deepEqual(requestPopupOpen(true), { shouldOpen: false, nextState: true });
});
