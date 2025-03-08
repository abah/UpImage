let originalImage = null;
let originalFileType = null;
let processedImageData = null;

// Apply noise reduction
function applyNoiseReduction(ctx, canvas, amount) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a copy of the image data
    const tempData = new Uint8ClampedArray(data);
    
    // Reduce intensity for more natural results
    const intensity = amount * 0.5;
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;
            let count = 0;
            
            // Calculate weighted average of surrounding pixels
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    // Increase center pixel weight
                    const weight = (ky === 0 && kx === 0) ? 4 : 1;
                    r += tempData[idx] * weight;
                    g += tempData[idx + 1] * weight;
                    b += tempData[idx + 2] * weight;
                    count += weight;
                }
            }
            
            const idx = (y * width + x) * 4;
            
            // Preserve more of the original color
            data[idx] = Math.round(tempData[idx] * (1 - intensity) + (r / count) * intensity);
            data[idx + 1] = Math.round(tempData[idx + 1] * (1 - intensity) + (g / count) * intensity);
            data[idx + 2] = Math.round(tempData[idx + 2] * (1 - intensity) + (b / count) * intensity);
            data[idx + 3] = tempData[idx + 3]; // Preserve alpha
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Apply face enhancement
function applyFaceEnhancement(ctx, canvas, amount) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a copy of the image data
    const tempData = new Uint8ClampedArray(data);
    
    // Reduce intensity significantly
    const intensity = amount * 0.3;
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let r = 0, g = 0, b = 0;
            let weightSum = 0;
            
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const currentIdx = (y * width + x) * 4;
                    
                    // Reduce color difference sensitivity
                    const colorDiff = Math.sqrt(
                        Math.pow(tempData[idx] - tempData[currentIdx], 2) +
                        Math.pow(tempData[idx + 1] - tempData[currentIdx + 1], 2) +
                        Math.pow(tempData[idx + 2] - tempData[currentIdx + 2], 2)
                    ) / 3;
                    
                    const weight = Math.exp(-colorDiff / 30);
                    
                    r += tempData[idx] * weight;
                    g += tempData[idx + 1] * weight;
                    b += tempData[idx + 2] * weight;
                    weightSum += weight;
                }
            }
            
            const idx = (y * width + x) * 4;
            data[idx] = Math.round(tempData[idx] * (1 - intensity) + (r / weightSum) * intensity);
            data[idx + 1] = Math.round(tempData[idx + 1] * (1 - intensity) + (g / weightSum) * intensity);
            data[idx + 2] = Math.round(tempData[idx + 2] * (1 - intensity) + (b / weightSum) * intensity);
            data[idx + 3] = tempData[idx + 3]; // Preserve alpha
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Apply sharpening filter
function applySharpening(ctx, width, height, amount) {
    try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const tempData = new Uint8ClampedArray(data);
        
        // Reduce sharpening intensity
        const intensity = amount * 0.6;
        const center = 1 + (3 * intensity);
        const outer = -intensity * 0.5;
        
        const kernel = [
            [0, outer, 0],
            [outer, center, outer],
            [0, outer, 0]
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                let r = 0, g = 0, b = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const offset = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[ky + 1][kx + 1];
                        
                        r += tempData[offset] * weight;
                        g += tempData[offset + 1] * weight;
                        b += tempData[offset + 2] * weight;
                    }
                }
                
                // Reduce contrast enhancement
                const contrastFactor = 1.05;
                
                r = (r - 128) * contrastFactor + 128;
                g = (g - 128) * contrastFactor + 128;
                b = (b - 128) * contrastFactor + 128;
                
                data[idx] = Math.min(255, Math.max(0, Math.round(r)));
                data[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
                data[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
                data[idx + 3] = tempData[idx + 3]; // Preserve alpha
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    } catch (error) {
        console.error('Sharpening error:', error);
    }
}

// Update the updateImageInfo function
function updateImageInfo(width, height, type, elementId, quality = null) {
    const info = document.getElementById(elementId);
    let text = `${width}x${height}px - ${type.split('/')[1].toUpperCase()}`;
    if (quality !== null) {
        text += ` (Quality: ${Math.round(quality * 100)}%)`;
    }
    info.textContent = text;
}

// Initialize elements
const imageInput = document.getElementById('imageInput');
const dropZone = document.getElementById('dropZone');
const controls = document.querySelector('.controls');
const buttonGroup = document.querySelector('.button-group');
const imageContainer = document.querySelector('.image-container');
const originalImageElement = document.getElementById('originalImage');
const upscaledImageElement = document.getElementById('upscaledImage');
const originalInfo = document.getElementById('originalInfo');
const upscaledInfo = document.getElementById('upscaledInfo');
const processingInfo = document.getElementById('processingInfo');

// Show UI elements when image is loaded
function showUIElements() {
    controls.classList.add('visible');
    buttonGroup.classList.add('visible');
    imageContainer.classList.add('visible');
}

// Hide UI elements
function hideUIElements() {
    controls.classList.remove('visible');
    buttonGroup.classList.remove('visible');
    imageContainer.classList.remove('visible');
}

// Handle file selection
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImageElement.src = e.target.result;
            originalImageElement.onload = function() {
                // Show all UI elements
                controls.classList.add('visible');
                buttonGroup.classList.add('visible');
                imageContainer.classList.add('visible');
                
                // Update image info
                const width = this.naturalWidth;
                const height = this.naturalHeight;
                const type = file.type;
                updateImageInfo(width, height, type, 'originalInfo');
            };
        };
        reader.readAsDataURL(file);
    }
}

// Handle drag and drop
function handleDrop(event) {
    event.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        imageInput.files = event.dataTransfer.files;
        handleImageSelect({ target: { files: [file] } });
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    dropZone.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    dropZone.classList.remove('drag-over');
}

// Show processing state
function showProcessing(message) {
    document.body.classList.add('processing');
    const processingInfo = document.getElementById('processingInfo');
    
    // Reset display and force reflow
    processingInfo.style.display = 'none';
    processingInfo.offsetHeight;
    processingInfo.style.display = 'block';
    
    const statusText = processingInfo.querySelector('.status-text');
    statusText.textContent = message || 'Processing image...';
    
    // Reset progress bar animation
    const progressBar = processingInfo.querySelector('.progress-bar');
    progressBar.style.animation = 'none';
    progressBar.offsetHeight;
    progressBar.style.animation = '';
}

// Hide processing state
function hideProcessing() {
    const processingInfo = document.getElementById('processingInfo');
    processingInfo.style.display = 'none';
    document.body.classList.remove('processing');
}

// Show preview loading state
function showPreviewLoading(previewId) {
    const container = document.getElementById(previewId).closest('.preview-container');
    if (container) {
        // Reset animation and force reflow
        container.classList.remove('loading');
        container.offsetHeight;
        container.classList.add('loading');
    }
}

// Hide preview loading state
function hidePreviewLoading(previewId) {
    const container = document.getElementById(previewId).closest('.preview-container');
    if (container) {
        container.classList.remove('loading');
    }
}

// Upscaling function
async function upscaleImage() {
    if (!originalImageElement.complete || !originalImageElement.naturalWidth) {
        alert('Please wait for the image to load completely.');
        return;
    }

    const scaleFactor = parseFloat(document.getElementById('scaleFactor').value);
    const sharpness = parseFloat(document.getElementById('sharpness').value);
    const noiseReduction = parseFloat(document.getElementById('noiseReduction').value);
    const faceEnhancement = parseFloat(document.getElementById('faceEnhancement').value);
    const quality = parseFloat(document.getElementById('quality').value);
    const targetDPI = parseInt(document.getElementById('targetDPI').value);
    
    const upscaleButton = document.getElementById('upscaleButton');
    const downloadButton = document.getElementById('downloadButton');
    upscaleButton.disabled = true;
    downloadButton.disabled = true;

    try {
        showProcessing('Preparing image...');
        showPreviewLoading('upscaledImage');

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { 
            willReadFrequently: true,
            alpha: true
        });
        
        if (!ctx) {
            throw new Error('Could not initialize canvas context');
        }

        // Calculate dimensions
        showProcessing('Calculating dimensions...');
        const dpiScaleFactor = targetDPI / 72;
        const totalScaleFactor = scaleFactor * dpiScaleFactor;
        
        let newWidth = Math.round(originalImageElement.naturalWidth * totalScaleFactor);
        let newHeight = Math.round(originalImageElement.naturalHeight * totalScaleFactor);

        // Limit maximum dimensions
        const maxDimension = 8000;
        if (newWidth > maxDimension || newHeight > maxDimension) {
            const scale = maxDimension / Math.max(newWidth, newHeight);
            newWidth = Math.round(newWidth * scale);
            newHeight = Math.round(newHeight * scale);
        }
        
        if (newWidth <= 0 || newHeight <= 0 || !Number.isFinite(newWidth) || !Number.isFinite(newHeight)) {
            throw new Error('Invalid image dimensions calculated');
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // High quality upscaling
        showProcessing('Upscaling image...');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(originalImageElement, 0, 0, newWidth, newHeight);

        // Apply post-processing
        if (noiseReduction > 0) {
            showProcessing('Reducing noise...');
            applyNoiseReduction(ctx, canvas, noiseReduction);
        }
        
        if (faceEnhancement > 0) {
            showProcessing('Enhancing details...');
            applyFaceEnhancement(ctx, canvas, faceEnhancement);
        }
        
        if (sharpness > 0) {
            showProcessing('Applying sharpening...');
            applySharpening(ctx, newWidth, newHeight, sharpness);
        }

        // Handle image quality
        showProcessing('Generating final image...');
        const isPNG = originalImageElement.src.includes('data:image/png');
        const outputFormat = isPNG ? 'image/png' : 'image/jpeg';
        const outputQuality = Math.max(0.1, Math.min(1.0, quality));

        // Generate final image
        const dataUrl = canvas.toDataURL(outputFormat, outputQuality);
        
        if (!dataUrl || dataUrl === 'data:,') {
            throw new Error('Failed to generate image data');
        }
        
        upscaledImageElement.onload = function() {
            updateImageInfo(newWidth, newHeight, outputFormat, 'upscaledInfo', outputQuality);
            upscaleButton.disabled = false;
            downloadButton.disabled = false;
            
            upscaledImageElement.dataset.quality = outputQuality;
            upscaledImageElement.dataset.format = outputFormat;
            
            hideProcessing();
            hidePreviewLoading('upscaledImage');
        };
        
        upscaledImageElement.onerror = function() {
            throw new Error('Failed to load processed image');
        };
        
        upscaledImageElement.src = dataUrl;

    } catch (error) {
        console.error('Error during image processing:', error);
        alert('Error: ' + (error.message || 'Failed to process image. Please try again.'));
        upscaleButton.disabled = false;
        downloadButton.disabled = true;
        hideProcessing();
        hidePreviewLoading('upscaledImage');
    }
}

// Update the download function
function downloadImage() {    
    // Get stored quality and format
    const quality = parseFloat(upscaledImageElement.dataset.quality || 0.8);
    const format = upscaledImageElement.dataset.format || 'image/jpeg';
    
    // Create a temporary canvas
    const canvas = document.createElement('canvas');
    canvas.width = upscaledImageElement.naturalWidth;
    canvas.height = upscaledImageElement.naturalHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(upscaledImageElement, 0, 0);
    
    // Generate download file
    const dataUrl = canvas.toDataURL(format, quality);
    const extension = format === 'image/png' ? 'png' : 'jpg';
    
    const link = document.createElement('a');
    link.download = `upscaled-image.${extension}`;
    link.href = dataUrl;
    link.click();
}

// Initialize event listeners
imageInput.addEventListener('change', handleImageSelect);
dropZone.addEventListener('drop', handleDrop);
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);

// Initially hide UI elements
hideUIElements(); 