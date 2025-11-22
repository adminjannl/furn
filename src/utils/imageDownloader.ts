export async function downloadImage(imageUrl: string, productName: string): Promise<string> {
  try {
    const response = await fetch(imageUrl, {
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    const fileName = `${productName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;

    const localUrl = URL.createObjectURL(blob);

    return localUrl;
  } catch (error) {
    console.error('Error downloading image:', error);
    return imageUrl;
  }
}

export async function downloadAllProductImages(
  imageUrls: string[],
  productName: string
): Promise<string[]> {
  const downloadPromises = imageUrls.map((url, index) =>
    downloadImage(url, `${productName}-${index}`)
  );

  try {
    const downloadedUrls = await Promise.all(downloadPromises);
    return downloadedUrls;
  } catch (error) {
    console.error('Error downloading product images:', error);
    return imageUrls;
  }
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    return imageExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}

export async function uploadToSupabaseStorage(
  blob: Blob,
  fileName: string,
  bucket: string = 'product-images'
): Promise<string | null> {
  try {
    return fileName;
  } catch (error) {
    console.error('Error uploading to storage:', error);
    return null;
  }
}
