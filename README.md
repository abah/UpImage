# UpImage - AI-Powered Image Upscaler

<div align="center">
  <img src="assets/logo.png" alt="UpImage Logo" width="600" style="max-width: 100%; height: auto; margin: 20px 0;"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Made with TensorFlow](https://img.shields.io/badge/Made%20with-TensorFlow-orange.svg)](https://www.tensorflow.org)
  [![GitHub stars](https://img.shields.io/github/stars/abah/UpImage.svg)](https://github.com/abah/UpImage/stargazers)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)
</div>

UpImage is a cutting-edge web application that leverages the power of artificial intelligence to enhance and upscale images while preserving quality and detail. Using state-of-the-art deep learning models (ESRGAN and SRCNN), it provides professional-grade image upscaling suitable for both personal and commercial use.

## Why UpImage?

- **Professional Quality**: Achieve print-ready results with our AI-powered upscaling
- **User-Friendly**: Simple interface with powerful features under the hood
- **No Installation**: Works directly in your browser - no software to install
- **Privacy First**: All processing happens locally - your images never leave your device
- **Free & Open Source**: Completely free to use and open for community contributions

## Features

- **AI-Powered Upscaling**: Using ESRGAN and SRCNN models for high-quality image enhancement
- **Multiple Resolution Options**: 
  - 300 DPI for print-ready output
  - 150 DPI for web optimization
  - 72 DPI for screen display
- **Advanced Enhancement Settings**:
  - Noise reduction
  - Face enhancement
  - Detail sharpening
  - Quality control
- **Format Support**: 
  - PNG (lossless)
  - JPEG (configurable quality)
- **Modern UI/UX**:
  - Real-time preview
  - Side-by-side enhancement settings
  - Progress indicators
  - Responsive design

## How It Works

UpImage uses advanced deep learning models to analyze and enhance your images:

1. **Image Analysis**: AI models analyze the image structure, textures, and patterns
2. **Smart Upscaling**: ESRGAN/SRCNN models predict and generate missing details
3. **Enhancement**: Advanced algorithms for noise reduction and detail preservation
4. **Quality Control**: Intelligent processing to maintain image quality and prevent artifacts

### Supported Image Types

- **Input Formats**: 
  - JPEG/JPG (all quality levels)
  - PNG (with transparency support)
  - WebP
  - BMP
  
- **Output Options**:
  - High-quality PNG for lossless results
  - Optimized JPEG with adjustable compression
  - Custom DPI settings for various use cases

### Use Cases

- **Photography**: Enhance old or low-resolution photos
- **Graphic Design**: Upscale logos and artwork for print
- **Web Development**: Prepare images for high-DPI displays
- **Digital Art**: Increase resolution of digital artwork
- **Document Processing**: Improve scanned document quality

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari)
- Internet connection for AI model loading

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abah/UpImage.git
cd UpImage
```

2. Open `index.html` in your web browser

### Usage

1. Click "Choose File" or drag & drop an image
2. Select desired DPI setting (72, 150, or 300)
3. Adjust enhancement settings:
   - Move sliders for noise reduction, sharpening, etc.
   - Toggle face enhancement if needed
4. Click "Upscale Image"
5. Download the enhanced result

## Performance Considerations

- Recommended minimum 4GB RAM for optimal performance
- Processing time varies based on:
  - Image size and complexity
  - Selected AI model (ESRGAN vs SRCNN)
  - Enhancement settings
  - Device capabilities

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript
- **AI Models**: TensorFlow.js implementation of ESRGAN/SRCNN
- **Image Processing**: Canvas API with optimized memory management
- **UI Framework**: Custom CSS with modern design principles

## Future Roadmap

- Additional AI models for specialized use cases
- Batch processing capabilities
- Custom model training options
- API integration for automated workflows
- Mobile-optimized version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ESRGAN and SRCNN model implementations
- TensorFlow.js team
- Open source community

## Contact

- GitHub: [@abah](https://github.com/abah) 