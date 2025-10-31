"""
Crop Recommendation Service
Provides recommendations based on disease detection results
Covers all 27 classes from PlantDoc dataset
"""

from typing import Dict

class CropRecommendationService:
    """Service for generating crop disease recommendations"""
    
    def __init__(self):
        """Initialize recommendation service with disease knowledge base"""
        # Complete recommendations for all 27 classes in English
        self.recommendations_en = {
            # Apple diseases
            "apple scab leaf": {
                "description": "Apple Scab is a fungal disease that causes dark, scabby lesions on leaves, fruits, and twigs.",
                "recommendations": [
                    "Remove and destroy infected leaves and fruit immediately",
                    "Apply fungicides containing captan, mancozeb, or myclobutanil",
                    "Prune trees to improve air circulation",
                    "Rake and destroy fallen leaves in autumn",
                    "Plant scab-resistant apple varieties",
                    "Water at the base, avoid wetting foliage",
                    "Apply preventative sprays in early spring"
                ]
            },
            "apple leaf": {
                "description": "Your apple leaf appears healthy!",
                "recommendations": [
                    "Continue monitoring for early signs of disease",
                    "Maintain proper watering and nutrition",
                    "Prune regularly to improve air circulation",
                    "Apply preventative fungicides during wet seasons",
                    "Inspect leaves weekly for any changes"
                ]
            },
            "apple rust leaf": {
                "description": "Apple Rust is a fungal disease that causes orange to yellow spots on leaves.",
                "recommendations": [
                    "Remove infected leaves promptly",
                    "Apply fungicides containing myclobutanil or propiconazole",
                    "Remove nearby juniper trees (alternate host) if possible",
                    "Ensure adequate spacing between trees",
                    "Water early in the day so leaves dry quickly",
                    "Use rust-resistant varieties"
                ]
            },
            # Bell Pepper diseases
            "bell_pepper leaf": {
                "description": "Your bell pepper leaf appears healthy!",
                "recommendations": [
                    "Maintain consistent watering schedule",
                    "Provide balanced fertilizer regularly",
                    "Monitor for pests and diseases",
                    "Ensure proper spacing between plants",
                    "Use mulch to retain moisture"
                ]
            },
            "bell_pepper leaf spot": {
                "description": "Bell Pepper Leaf Spot is a bacterial or fungal disease causing spots on leaves.",
                "recommendations": [
                    "Remove and destroy infected leaves immediately",
                    "Apply copper-based fungicides or bactericides",
                    "Avoid overhead watering",
                    "Improve air circulation by spacing plants properly",
                    "Use disease-free seeds and transplants",
                    "Practice crop rotation",
                    "Water at the base of plants"
                ]
            },
            # Blueberry
            "blueberry leaf": {
                "description": "Your blueberry leaf appears healthy!",
                "recommendations": [
                    "Maintain acidic soil (pH 4.5-5.5)",
                    "Provide consistent moisture",
                    "Apply mulch around plants",
                    "Prune dead or diseased branches",
                    "Monitor for pests"
                ]
            },
            # Cherry
            "cherry leaf": {
                "description": "Your cherry leaf appears healthy!",
                "recommendations": [
                    "Continue regular maintenance",
                    "Prune to maintain tree shape and health",
                    "Apply balanced fertilizer in early spring",
                    "Water deeply during dry periods",
                    "Monitor for common cherry diseases"
                ]
            },
            # Corn diseases
            "corn gray leaf spot": {
                "description": "Corn Gray Leaf Spot is a fungal disease that affects corn leaves.",
                "recommendations": [
                    "Remove crop residue after harvest",
                    "Practice crop rotation with non-corn crops",
                    "Use resistant hybrid varieties",
                    "Apply fungicides containing strobilurin or triazole",
                    "Ensure proper plant spacing for air circulation",
                    "Avoid excessive nitrogen fertilization"
                ]
            },
            "corn leaf blight": {
                "description": "Corn Leaf Blight is a serious fungal disease that can significantly reduce yield.",
                "recommendations": [
                    "Plant resistant corn varieties",
                    "Practice crop rotation (2-3 year intervals)",
                    "Remove and destroy infected plant debris",
                    "Apply fungicides preventatively during warm, humid weather",
                    "Ensure adequate spacing for air circulation",
                    "Avoid planting in areas with poor drainage"
                ]
            },
            "corn rust leaf": {
                "description": "Corn Rust causes small, powdery spots on leaves that can reduce photosynthesis.",
                "recommendations": [
                    "Plant rust-resistant corn varieties",
                    "Apply fungicides containing azoxystrobin or propiconazole",
                    "Practice crop rotation",
                    "Remove infected plant debris after harvest",
                    "Monitor weather conditions (warm, humid weather favors rust)",
                    "Ensure proper plant nutrition"
                ]
            },
            # Peach
            "peach leaf": {
                "description": "Your peach leaf appears healthy!",
                "recommendations": [
                    "Maintain proper pruning schedule",
                    "Apply balanced fertilizer in spring",
                    "Water deeply during dry periods",
                    "Monitor for peach leaf curl and other diseases",
                    "Use dormant sprays in late winter"
                ]
            },
            # Potato diseases
            "potato leaf early blight": {
                "description": "Potato Early Blight is a fungal disease that causes target-like lesions on leaves.",
                "recommendations": [
                    "Remove and destroy infected leaves immediately",
                    "Apply fungicides containing chlorothalonil or mancozeb",
                    "Water at the base, avoid overhead irrigation",
                    "Use certified disease-free seed potatoes",
                    "Practice crop rotation (3-4 years)",
                    "Apply mulch to prevent soil splash",
                    "Space plants properly for air circulation"
                ]
            },
            "potato leaf late blight": {
                "description": "Potato Late Blight is a devastating disease that can destroy entire crops rapidly.",
                "recommendations": [
                    "Remove and destroy ALL infected plants immediately",
                    "Apply copper-based fungicides preventatively",
                    "Use late blight-resistant varieties when available",
                    "Improve air circulation with proper spacing",
                    "Avoid overhead watering",
                    "Practice strict crop rotation",
                    "Monitor weather conditions closely (cool, wet weather spreads quickly)"
                ]
            },
            # Raspberry
            "raspberry leaf": {
                "description": "Your raspberry leaf appears healthy!",
                "recommendations": [
                    "Maintain well-drained soil",
                    "Prune canes after harvest",
                    "Apply balanced fertilizer in spring",
                    "Keep area weed-free",
                    "Monitor for common raspberry diseases"
                ]
            },
            # Soybean
            "soyabean leaf": {
                "description": "Your soybean leaf appears healthy!",
                "recommendations": [
                    "Continue regular monitoring",
                    "Maintain proper soil pH (6.0-6.5)",
                    "Practice crop rotation",
                    "Ensure adequate moisture during critical growth stages",
                    "Monitor for pests and diseases regularly"
                ]
            },
            # Squash disease
            "squash powdery mildew leaf": {
                "description": "Powdery Mildew on squash appears as white powdery coating on leaves.",
                "recommendations": [
                    "Apply fungicides containing sulfur, potassium bicarbonate, or neem oil",
                    "Improve air circulation by spacing plants properly",
                    "Water at the base, avoid wetting leaves",
                    "Remove infected leaves promptly",
                    "Use resistant varieties when available",
                    "Prune dense foliage to increase air flow",
                    "Apply preventative sprays in early morning"
                ]
            },
            # Strawberry
            "strawberry leaf": {
                "description": "Your strawberry leaf appears healthy!",
                "recommendations": [
                    "Maintain consistent moisture (especially during fruit development)",
                    "Remove old leaves after harvest",
                    "Apply balanced fertilizer",
                    "Use mulch to suppress weeds and retain moisture",
                    "Monitor for common strawberry diseases"
                ]
            },
            # Tomato diseases
            "tomato early blight leaf": {
                "description": "Tomato Early Blight causes brown spots with concentric rings on leaves.",
                "recommendations": [
                    "Remove infected leaves immediately",
                    "Apply fungicides containing chlorothalonil or copper",
                    "Ensure proper spacing (2-3 feet apart)",
                    "Water at the base, never overhead",
                    "Use disease-free transplants",
                    "Practice crop rotation (3-4 years)",
                    "Stake plants to improve air circulation",
                    "Mulch around plants to prevent soil splash"
                ]
            },
            "tomato septoria leaf spot": {
                "description": "Tomato Septoria Leaf Spot causes small circular spots with dark margins on leaves.",
                "recommendations": [
                    "Remove and destroy infected leaves immediately",
                    "Apply copper-based fungicides",
                    "Improve air circulation with proper spacing and staking",
                    "Water at the base, avoid overhead irrigation",
                    "Practice crop rotation (3 years minimum)",
                    "Use disease-free seeds and transplants",
                    "Remove plant debris after harvest",
                    "Avoid working with plants when leaves are wet"
                ]
            },
            "tomato leaf": {
                "description": "Your tomato leaf appears healthy!",
                "recommendations": [
                    "Maintain consistent watering (deep, infrequent watering)",
                    "Provide balanced fertilizer regularly",
                    "Stake or cage plants for support",
                    "Monitor for early signs of common tomato diseases",
                    "Prune lower leaves to improve air circulation"
                ]
            },
            "tomato leaf bacterial spot": {
                "description": "Tomato Bacterial Spot causes small, water-soaked lesions that turn brown.",
                "recommendations": [
                    "Remove and destroy infected plant parts immediately",
                    "Apply copper-based bactericides early in the season",
                    "Use certified disease-free seeds and transplants",
                    "Avoid overhead watering",
                    "Practice crop rotation",
                    "Disinfect tools between uses",
                    "Improve air circulation",
                    "Avoid working with plants when they are wet"
                ]
            },
            "tomato leaf late blight": {
                "description": "Tomato Late Blight is a serious disease that can destroy entire plants within days.",
                "recommendations": [
                    "Remove and destroy ALL infected plants immediately",
                    "Apply copper-based fungicides preventatively",
                    "Use late blight-resistant varieties",
                    "Ensure excellent air circulation",
                    "Water only at the base",
                    "Practice strict crop rotation",
                    "Monitor weather conditions (cool, wet weather is dangerous)",
                    "Do not compost infected plants"
                ]
            },
            "tomato leaf mosaic virus": {
                "description": "Tomato Mosaic Virus cannot be cured. Infected plants must be removed.",
                "recommendations": [
                    "Remove and destroy infected plants immediately (do not compost)",
                    "Control aphids and other insect vectors",
                    "Use virus-free certified seeds and transplants",
                    "Disinfect tools and hands after handling infected plants",
                    "Remove weeds that may harbor the virus",
                    "Plant resistant varieties when available",
                    "Practice strict sanitation"
                ]
            },
            "tomato leaf yellow virus": {
                "description": "Tomato Yellow Virus causes yellowing and stunting. Plants cannot recover.",
                "recommendations": [
                    "Remove and destroy infected plants immediately",
                    "Control whiteflies and aphids (virus vectors)",
                    "Use virus-free certified seeds",
                    "Remove nearby weeds and alternative hosts",
                    "Use reflective mulches to deter insects",
                    "Plant resistant varieties",
                    "Practice strict crop rotation"
                ]
            },
            "tomato mold leaf": {
                "description": "Mold on tomato leaves indicates high humidity and poor air circulation.",
                "recommendations": [
                    "Improve air circulation by spacing plants properly and staking",
                    "Reduce humidity by watering at the base only",
                    "Remove infected leaves promptly",
                    "Apply fungicides containing copper or sulfur",
                    "Prune lower leaves and dense foliage",
                    "Water early in the day so leaves dry quickly",
                    "Use resistant varieties when available"
                ]
            },
            # Grape diseases
            "grape leaf": {
                "description": "Your grape leaf appears healthy!",
                "recommendations": [
                    "Prune vines regularly for optimal air circulation",
                    "Provide adequate trellising support",
                    "Monitor for common grape diseases",
                    "Apply balanced fertilizer in spring",
                    "Maintain consistent soil moisture"
                ]
            },
            "grape leaf black rot": {
                "description": "Grape Black Rot is a fungal disease that causes circular lesions and fruit rot.",
                "recommendations": [
                    "Remove and destroy infected leaves, fruit, and canes",
                    "Apply fungicides containing captan, myclobutanil, or mancozeb",
                    "Prune to improve air circulation",
                    "Remove mummified fruit from vines",
                    "Practice good sanitation",
                    "Apply preventative sprays starting at bud break",
                    "Ensure proper vine spacing"
                ]
            }
        }
        
        # Urdu translations for key classes
        self.recommendations_ur = {
            "apple scab leaf": {
                "description": "سیب کی سکبی بیماری ایک فنگل بیماری ہے جو پتوں، پھلوں اور شاخوں پر گہرے، کھردرے زخم پیدا کرتی ہے۔",
                "recommendations": [
                    "متاثرہ پتوں اور پھلوں کو فوری طور پر ہٹا دیں اور تباہ کر دیں",
                    "کیپٹان، مینکوزیب یا مائی کلوبوٹینل پر مشتمل فنگیسائڈز لگائیں",
                    "بہتر ہوا کی گردش کے لیے درختوں کی کٹائی کریں",
                    "خزاں میں گرے ہوئے پتے اکٹھے کریں اور تباہ کریں",
                    "مزاحم سیب کی اقسام لگائیں"
                ]
            },
            "apple leaf": {
                "description": "آپ کے سیب کا پتہ صحت مند لگ رہا ہے!",
                "recommendations": [
                    "بیماری کی ابتدائی علامات کی باقاعدہ نگرانی جاری رکھیں",
                    "مناسب پانی اور غذائی اجزاء برقرار رکھیں",
                    "ہوا کی گردش بہتر بنانے کے لیے باقاعدہ کٹائی کریں",
                    "تر کہیوں میں احتیاطی فنگیسائڈز لگائیں"
                ]
            },
            "tomato early blight leaf": {
                "description": "ٹماٹر کی ابتدائی بلائٹ پتوں پر گہرے دائرے والے داغ پیدا کرتی ہے۔",
                "recommendations": [
                    "متاثرہ پتے فوری طور پر ہٹا دیں",
                    "کلوروتھالونیل یا تانبے پر مشتمل فنگیسائڈز لگائیں",
                    "مناسب فاصلہ رکھیں (2-3 فٹ)",
                    "صرف بنیاد پر پانی دیں، اوپر سے کبھی نہیں",
                    "بیماری سے پاک پودے استعمال کریں"
                ]
            },
            "tomato leaf late blight": {
                "description": "ٹماٹر کی دیر سے بلائٹ ایک سنگین بیماری ہے جو پورے پودوں کو دنوں میں تباہ کر سکتی ہے۔",
                "recommendations": [
                    "تمام متاثرہ پودوں کو فوری طور پر ہٹا دیں اور تباہ کر دیں",
                    "احتیاطی طور پر تانبے پر مبنی فنگیسائڈز لگائیں",
                    "بہترین ہوا کی گردش یقینی بنائیں",
                    "صرف بنیاد پر پانی دیں",
                    "سخت فصل کی گردش کا طریقہ اپنائیں"
                ]
            },
            "grape leaf": {
                "description": "آپ کا انگور کا پتہ صحت مند لگ رہا ہے!",
                "recommendations": [
                    "بہترین ہوا کی گردش کے لیے باقاعدہ بیل کی کٹائی کریں",
                    "کافی سہارا فراہم کریں",
                    "عام انگور کی بیماریوں کی نگرانی کریں",
                    "بہار میں متوازن کھاد ڈالیں"
                ]
            }
        }
    
    def get_recommendations(
        self,
        class_name: str,
        confidence: float,
        language: str = "en"
    ) -> str:
        """
        Get recommendations based on detected disease/class
        
        Args:
            class_name: Name of the detected class (from all 27 classes)
            confidence: Confidence score (0-1)
            language: Language code (en, ur)
        
        Returns:
            Formatted recommendation string
        """
        class_name_lower = class_name.lower().strip()
        
        # Select recommendation set based on language
        recommendations_dict = (
            self.recommendations_ur if language == "ur" 
            else self.recommendations_en
        )
        
        # Direct lookup for exact class name
        disease_info = recommendations_dict.get(class_name_lower)
        
        # If not found, try case-insensitive partial match
        if not disease_info:
            for key, value in recommendations_dict.items():
                if key in class_name_lower or class_name_lower in key:
                    disease_info = value
                    break
        
        # Fallback: check for disease patterns
        if not disease_info:
            if any(keyword in class_name_lower for keyword in ["early blight"]):
                disease_info = recommendations_dict.get("tomato early blight leaf") or recommendations_dict.get("potato leaf early blight")
            elif any(keyword in class_name_lower for keyword in ["late blight"]):
                disease_info = recommendations_dict.get("tomato leaf late blight") or recommendations_dict.get("potato leaf late blight")
            elif "septoria" in class_name_lower or "leaf spot" in class_name_lower:
                disease_info = recommendations_dict.get("tomato septoria leaf spot") or recommendations_dict.get("bell_pepper leaf spot")
            elif "rust" in class_name_lower:
                disease_info = recommendations_dict.get("apple rust leaf") or recommendations_dict.get("corn rust leaf")
            elif "bacterial" in class_name_lower:
                disease_info = recommendations_dict.get("tomato leaf bacterial spot") or recommendations_dict.get("bell_pepper leaf spot")
            elif "virus" in class_name_lower or "mosaic" in class_name_lower:
                disease_info = recommendations_dict.get("tomato leaf mosaic virus") or recommendations_dict.get("tomato leaf yellow virus")
            elif "mold" in class_name_lower:
                disease_info = recommendations_dict.get("tomato mold leaf")
            elif "mildew" in class_name_lower or "powdery" in class_name_lower:
                disease_info = recommendations_dict.get("squash powdery mildew leaf")
            elif "scab" in class_name_lower:
                disease_info = recommendations_dict.get("apple scab leaf")
            elif "rot" in class_name_lower:
                disease_info = recommendations_dict.get("grape leaf black rot")
            elif "gray" in class_name_lower or "grey" in class_name_lower:
                disease_info = recommendations_dict.get("corn gray leaf spot")
            elif "blight" in class_name_lower:
                disease_info = recommendations_dict.get("corn leaf blight")
        
        # Default to generic healthy recommendations if class is healthy-looking
        if not disease_info:
            # Check if it's a healthy leaf class
            if any(keyword in class_name_lower for keyword in [
                "leaf", "healthy", "apple leaf", "bell_pepper leaf", 
                "blueberry leaf", "cherry leaf", "peach leaf", 
                "raspberry leaf", "soyabean leaf", "strawberry leaf",
                "tomato leaf", "grape leaf"
            ]) and not any(disease in class_name_lower for disease in [
                "scab", "rust", "spot", "blight", "bacterial", "virus",
                "mold", "mildew", "rot", "mosaic", "yellow"
            ]):
                # Try to find healthy version of this plant
                plant_name = class_name_lower.split("leaf")[0].strip()
                healthy_key = f"{plant_name} leaf"
                disease_info = recommendations_dict.get(healthy_key)
        
        # Final fallback
        if not disease_info:
            if language == "en":
                disease_info = {
                    "description": f"Detected: {class_name}",
                    "recommendations": [
                        "Continue monitoring your plant regularly",
                        "Maintain proper watering and nutrition",
                        "Watch for early signs of disease",
                        "Practice good garden hygiene",
                        "If you notice disease symptoms, take appropriate action immediately"
                    ]
                }
            else:
                disease_info = {
                    "description": f"پتہ چلا: {class_name}",
                    "recommendations": [
                        "اپنے پودے کی باقاعدہ نگرانی جاری رکھیں",
                        "مناسب پانی اور غذائی اجزاء برقرار رکھیں",
                        "بیماری کی ابتدائی علامات پر نظر رکھیں",
                        "باغ کی اچھی حفظان صحت کا طریقہ اپنائیں"
                    ]
                }
        
        # Format recommendations
        description = disease_info.get("description", "")
        recommendations = disease_info.get("recommendations", [])
        
        # Build message
        message_parts = [description]
        
        if language == "en":
            message_parts.append(f"\n\nDetected: {class_name} (Confidence: {confidence:.1%})")
            if recommendations:
                message_parts.append("\n\nRecommendations:")
        else:
            message_parts.append(f"\n\nپتہ چلا: {class_name} (اعتماد: {confidence:.1%})")
            if recommendations:
                message_parts.append("\n\nتجاویز:")
        
        for i, rec in enumerate(recommendations, 1):
            message_parts.append(f"\n{i}. {rec}")
        
        return "".join(message_parts)
