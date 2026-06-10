export const PRODUCTS = [
  {
    id: 1,
    name: "QuantumPro Blade 16",
    category: "laptops",
    price: 2499.99,
    rating: 4.8,
    reviewsCount: 124,
    description: "The ultimate power workstation for creators, developers, and power users. Equipped with next-gen liquid metal cooling, a vapor chamber design, and a stunning Mini-LED display.",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    stock: 8,
    featured: true,
    specifications: {
      "Processor": "Intel Core i9-14900HX (24 Cores / 32 Threads)",
      "Graphics": "NVIDIA GeForce RTX 4090 16GB GDDR6",
      "Memory": "32GB DDR5 5600MHz (Dual Channel)",
      "Storage": "2TB NVMe PCIe Gen4 SSD",
      "Display": "16\" Mini-LED QHD+ 240Hz, 100% DCI-P3",
      "Battery": "99.9 Whr Lithium-Polymer",
      "Weight": "2.2 kg (4.85 lbs)"
    },
    features: [
      "CNC aluminum chassis with anodized matte black finish",
      "Per-key RGB keyboard powered by Razer Chroma",
      "Vapor chamber liquid cooling solution",
      "Thundebolt 4, HDMI 2.1, and SD Card Reader UHS-II ports"
    ]
  },
  {
    id: 2,
    name: "AeroBook Stealth Ultra",
    category: "laptops",
    price: 1399.99,
    rating: 4.6,
    reviewsCount: 89,
    description: "Featherlight design meets heavy-duty performance. Designed for nomadic professionals who demand elite productivity, long-lasting battery life, and visual luxury on the go.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    stock: 15,
    featured: false,
    specifications: {
      "Processor": "AMD Ryzen 7 8840U (8 Cores / 16 Threads, AI Engine)",
      "Graphics": "AMD Radeon 780M Graphics",
      "Memory": "16GB LPDDR5X 7500MHz",
      "Storage": "1TB PCIe Gen4 M.2 SSD",
      "Display": "14\" OLED 2.8K 120Hz Touchscreen, 100% DCI-P3",
      "Battery": "75 Whr with 65W GaN Fast Charger",
      "Weight": "1.1 kg (2.42 lbs)"
    },
    features: [
      "Ultra-thin 12.9mm profile with magnesium-alloy build",
      "AMD Ryzen AI engine delivering up to 39 NPU TOPS",
      "Double-sided fan cooling with zero decibel silent mode",
      "Wi-Fi 7 and Bluetooth 5.4 wireless technology"
    ]
  },
  {
    id: 3,
    name: "Nova X20 Fold",
    category: "smartphones",
    price: 1799.99,
    rating: 4.7,
    reviewsCount: 45,
    description: "Witness the future of communication. The Nova X20 Fold bends the rules of portable productivity by packing a massive tablet-grade workspace into a standard pocketable design.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    stock: 5,
    featured: true,
    specifications: {
      "Processor": "Snapdragon 8 Gen 3 (4nm Mobile Platform)",
      "Main Display": "8.02\" Foldable Dynamic LTPO AMOLED 2X, 120Hz",
      "Cover Display": "6.31\" LTPO AMOLED 120Hz, Gorilla Glass Armor",
      "Memory & Storage": "16GB RAM + 512GB UFS 4.0 Storage",
      "Rear Camera": "50MP Main (OIS) + 48MP Ultrawide + 64MP Periscope Zoom (5x)",
      "Front Camera": "32MP Cover + 20MP Under-display Internal",
      "Battery": "5000mAh Dual-Cell, 80W Wired / 50W Wireless Charging"
    },
    features: [
      "Carbon-fiber aerospace grade hinge system",
      "IPX8 Water Resistance rating",
      "Professional stylus compatibility with virtual desktop mode",
      "Triple speaker arrangement tuned by Harman Kardon"
    ]
  },
  {
    id: 4,
    name: "Apex Phone 15 Pro Max",
    category: "smartphones",
    price: 1199.99,
    rating: 4.9,
    reviewsCount: 342,
    description: "Engineered with titanium. Crafted for creators. The Apex Phone 15 Pro Max packs our most advanced mobile optics system ever, powered by a desktop-grade chipset.",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&auto=format&fit=crop&q=80",
    stock: 22,
    featured: true,
    specifications: {
      "Processor": "Apex A18 Pro Chipset (6-core GPU, 16-core NPU)",
      "Display": "6.7\" Super Retina XDR OLED, ProMotion 1-120Hz",
      "Memory & Storage": "8GB RAM + 256GB NVMe-grade Storage",
      "Rear Camera": "48MP Fusion + 12MP Ultra Wide + 12MP 5x Telephoto",
      "Front Camera": "12MP TrueDepth with AutoFocus",
      "Battery": "4422mAh, 25W Fast Charge, 15W MagSafe Support",
      "Weight": "221 grams"
    },
    features: [
      "Aerospace-grade titanium frame with textured matte glass back",
      "Customizable Action button for immediate shortcut access",
      "ProRes video recording up to 4K 60fps directly to external SSD",
      "USB-C port supporting USB 3 transfer speeds up to 10Gbps"
    ]
  },
  {
    id: 5,
    name: "SonicWave Pro 900",
    category: "audio",
    price: 349.99,
    rating: 4.5,
    reviewsCount: 212,
    description: "Escape the noise. Immerse yourself in pure studio quality sound. High-definition spatial audio, adaptive noise cancellation, and cloud-like memory foam earcups.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stock: 30,
    featured: false,
    specifications: {
      "Driver Type": "40mm Dynamic Driver with Neodymium magnets",
      "Frequency Response": "4Hz - 40,000Hz (Hi-Res Audio Wireless)",
      "Connectivity": "Bluetooth 5.3, Multipoint Connection, 3.5mm Jack",
      "ANC Technology": "Adaptive Auto NC Optimizer (8 microphones)",
      "Battery Life": "Up to 38 hours (ANC ON), 50 hours (ANC OFF)",
      "Charging Time": "3 min charge gives 5 hours playback (USB-PD)",
      "Audio Codecs": "LDAC, AAC, SBC, aptX Adaptive"
    },
    features: [
      "Touch sensors for swipe volume and playback control",
      "Speak-to-Chat function automatically pauses music on conversation",
      "Head-tracking spatial audio for movie theater realism",
      "Eco-friendly packaging and premium hardshell travel case"
    ]
  },
  {
    id: 6,
    name: "AeroPods Pro 2 SE",
    category: "audio",
    price: 199.99,
    rating: 4.7,
    reviewsCount: 178,
    description: "Compact wireless buds that punch far above their weight. Experience active noise cancelation, custom EQ, and seamless multi-device handoff.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    stock: 40,
    featured: true,
    specifications: {
      "Chipset": "H2 Audio Processing Chip",
      "Microphones": "Dual beamforming mics + Inward-facing mic",
      "Sensors": "Skin-detect sensor, Touch Control strip",
      "Dust & Water Resistance": "IP54 Sweat and Dust resistant (buds and case)",
      "Battery Life": "6 hours per charge (ANC ON); up to 30 hours with case",
      "Charging Support": "MagSafe, Apple Watch charger, USB-C",
      "Weight": "5.3 grams per earbud"
    },
    features: [
      "Precision Finding tracking speaker on the charging case",
      "Adaptive Audio dynamically blends Transparency and ANC modes",
      "Lanyard loop slot for extra security on the go",
      "Customizable high-excursion driver with low-distortion bass"
    ]
  },
  {
    id: 7,
    name: "Aegis Chrono Watch v3",
    category: "wearables",
    price: 299.99,
    rating: 4.4,
    reviewsCount: 63,
    description: "The ultimate rugged companion for elite athletes and adventurers. Complete with dual-frequency GPS, biometric vitals monitoring, and an ultra-tough sapphire crystal shield.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stock: 12,
    featured: false,
    specifications: {
      "Case Size": "47mm Titanium Grade 5 Case",
      "Display": "1.43\" AMOLED Always-On (466x466 pixels, 1000 nits)",
      "GPS": "Dual-Band Multi-GNSS Satellite System",
      "Sensors": "optical HR, SpO2, ECG, Barometer, Gyro, Temperature",
      "Water Resistance": "100 meters (10 ATM) / Dive Certified",
      "Battery Life": "Up to 14 days Smartwatch mode, 36 hours GPS mode",
      "Strap Width": "22mm QuickRelease Silicone / Nylon"
    },
    features: [
      "Built-in LED flashlight with strobe mode for night runs",
      "Tactical features: Stealth mode, Night vision compatibility",
      "Offline topographic maps and breadcrumb navigation",
      "Advanced sleep metrics, body battery tracking, and recovery advisor"
    ]
  },
  {
    id: 8,
    name: "Zenith Aura Smart Ring",
    category: "wearables",
    price: 269.99,
    rating: 4.6,
    reviewsCount: 51,
    description: "Sleek. Minimalist. Smart. The Zenith Aura Ring monitors your sleep, heart rate, activity, and temperature from the comfort of your finger. No screen, no distractions.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    stock: 0,
    featured: false,
    specifications: {
      "Material": "Titanium with PVD scratch-resistant coating",
      "Thickness": "2.5 mm",
      "Weight": "4 to 6 grams (depending on size)",
      "Sensors": "Red/Green/IR LEDs, 3D accelerometer, NTC temp sensors",
      "Water Resistance": "100 meters (330 feet)",
      "Battery Life": "Up to 7 days, fully charged in 80 minutes",
      "Sizes Available": "US Ring Sizes 6 to 13"
    },
    features: [
      "Understated jewelry design available in Gold, Stealth, and Silver",
      "Automatic nap detection and daily readiness analysis score",
      "Natural cycle tracking and temperature trend alerts",
      "No subscription fee — access all biometric data for free"
    ]
  },
  {
    id: 9,
    name: "Vortex GPU RX-990XT",
    category: "gaming",
    price: 999.99,
    rating: 4.9,
    reviewsCount: 76,
    description: "Redefine your gaming reality. Crushing framerates, cutting-edge raytracing, and neural AI super-resolution. Features a triple-fan copper plate cooler.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    stock: 4,
    featured: true,
    specifications: {
      "Architecture": "RDNA 4 Advanced Raytracing Cores",
      "Stream Processors": "6144 Cores",
      "Boost Clock": "Up to 2680 MHz",
      "Memory": "20GB GDDR7 (320-bit interface)",
      "Bus Interface": "PCI Express 5.0 x16",
      "Outputs": "3x DisplayPort 2.1, 1x HDMI 2.1a",
      "Recommended PSU": "850W (Requires 2x 8-pin PCIe power)"
    },
    features: [
      "Dynamic RGB lightbar syncable with motherboard software",
      "Reinforced alloy backplate for anti-sag protection",
      "Dual BIOS switch for Quiet or Performance profiles",
      "Includes premium support stand and GPU cleaning kit"
    ]
  },
  {
    id: 10,
    name: "Apex Vanguard Keyboard",
    category: "gaming",
    price: 179.99,
    rating: 4.7,
    reviewsCount: 112,
    description: "Ultra-fast magnetic Hall Effect switches. Adjust actuation heights per-key for absolute gaming dominance. Double-shot PBT keycaps on aircraft-grade aluminum.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    stock: 18,
    featured: false,
    specifications: {
      "Switch Type": "OmniPoint 2.0 Adjustable Magnetic Switches",
      "Actuation Range": "0.1mm to 4.0mm (Adjustable in 0.1mm steps)",
      "Response Time": "0.54 milliseconds",
      "Form Factor": "Tenkeyless (80% layout)",
      "Keycaps": "Double-shot PBT keycaps",
      "Connectivity": "Detachable Braided USB-C to USB-A",
      "Backlight": "Per-key RGB with custom reactive patterns"
    },
    features: [
      "Dual-action keypress: Program two actions for one key",
      "OLED Smart Display shows game status, profiles, and custom GIFs",
      "Magnetic premium soft-touch wrist rest included",
      "Onboard storage for up to 5 custom key profiles"
    ]
  },
  {
    id: 11,
    name: "OmniHub Smart Assistant",
    category: "smarthome",
    price: 129.99,
    rating: 4.3,
    reviewsCount: 143,
    description: "The core command deck of your home ecosystem. Features an 8-inch HD touch display, high-fidelity speaker array, and smart radar motion sensing for touchless control.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    stock: 25,
    featured: false,
    specifications: {
      "Display": "8.0\" IPS LCD Touchscreen (1280x800 resolution)",
      "Speaker System": "2.0 Channel (Stereo) with passive bass radiator",
      "Camera": "5MP Camera with physical privacy shutter",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.2, Thread, Matter",
      "Processor": "Quad-core ARM Processor with dedicated AI accelerator",
      "Microphones": "3x Far-field microphone array with voice match",
      "Dimensions": "200mm x 135mm x 99mm"
    },
    features: [
      "Built-in Zigbee and Matter controller hubs to sync devices directly",
      "Gesture controls: Pause music or snooze alarms by waving your hand",
      "Custom digital photo frame slideshow syncs with cloud albums",
      "Advanced privacy: Hardware switch disables mic and camera"
    ]
  },
  {
    id: 12,
    name: "Aura Glow Light Bar",
    category: "smarthome",
    price: 89.99,
    rating: 4.6,
    reviewsCount: 94,
    description: "Dynamic smart lighting bar that syncs with screen visual contents and sound waves. Creates an immersive desk workspace or living room media glow.",
    image: "https://images.unsplash.com/photo-1558002038-005ecca18d2e?w=800&auto=format&fit=crop&q=80",
    stock: 35,
    featured: false,
    specifications: {
      "Light Output": "650 Lumens (Tunable white + 16 million colors)",
      "Color Temperature": "2000K to 6500K",
      "Size": "42cm Length (Monitor mounted or table stand)",
      "Power Connection": "USB-C Powered (Requires 5V/2A input)",
      "Communication": "Bluetooth 5.0 + Wi-Fi 2.4GHz",
      "Life Hours": "25,000 Hours",
      "Control Methods": "Companion App, Voice Control, Physical Dial"
    },
    features: [
      "Sound sensing microphone reads ambient audio to flash or wave lights",
      "Monitor clamp fits flat or curved panels without screen glare",
      "Asymmetric optical design illuminates desk area only",
      "Integrates seamlessly with Razer Chroma, Alexa, and Google Home"
    ]
  }
];

/**
 * Simulates fetching products from an API with search and filter capability.
 * Includes a simulated 500ms network delay.
 */
export const getProducts = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...PRODUCTS];

      // Filter by category
      if (filters.category && filters.category !== "all") {
        filtered = filtered.filter(p => p.category === filters.category);
      }

      // Filter by search query
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      // Filter by price range
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
      }

      // Filter by stock status
      if (filters.inStockOnly) {
        filtered = filtered.filter(p => p.stock > 0);
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low-high":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-high-low":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case "popularity":
          default:
            filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
            break;
        }
      }

      resolve(filtered);
    }, 500);
  });
};

/**
 * Simulates fetching a single product details by ID with delay.
 */
export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = PRODUCTS.find(p => p.id === parseInt(id));
      if (product) {
        resolve(product);
      } else {
        reject(new Error("Product not found"));
      }
    }, 500);
  });
};
