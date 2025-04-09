document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsSection = document.getElementById('results-section');
    const sentimentValue = document.getElementById('sentiment-value');
    const thoughtsContent = document.getElementById('thoughts-content');
    const repliesContainer = document.getElementById('replies-container');
    
    // Initially hide results
    resultsSection.style.display = 'none';
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabType = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabType}-tab`).classList.add('active');
        });
    });
    
    // Handle file uploads
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--medium-gray)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--medium-gray)';
        
        if (e.dataTransfer.files.length) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });
    
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    function handleImageUpload(file) {
        if (!file.type.match('image.*')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
            imagePreview.style.display = 'block';
            uploadArea.style.display = 'none';
        };
        
        reader.readAsDataURL(file);
    }
    
    // Analyze button click
    analyzeBtn.addEventListener('click', () => {
        const textInput = document.getElementById('conversation-text').value;
        const hasImage = imagePreview.style.display === 'block';
        
        if (!textInput && !hasImage) {
            alert('Please provide a conversation (text or image) to analyze');
            return;
        }
        
        // Show loading state
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;
        
        // Simulate API call to analyze conversation
        setTimeout(() => {
            performAnalysis(textInput);
            
            // Reset button state
            analyzeBtn.textContent = 'Analyze';
            analyzeBtn.disabled = false;
            
            // Show results section
            resultsSection.style.display = 'flex';
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
    
    function performAnalysis(conversation) {
        // This is where you would make a real API call
        // For now, we'll use mock data
        
        // Simulate sentiment analysis (value between 0-100)
        const sentiment = Math.floor(Math.random() * 101);
        sentimentValue.style.width = `${sentiment}%`;
        
        // Mock thought analysis
        let thoughts;
        if (sentiment < 30) {
            thoughts = "This person seems disinterested or possibly upset with you. Their messages are short and lack enthusiasm. They might be busy or dealing with something else.";
        } else if (sentiment < 70) {
            thoughts = "They appear neutral but engaged in the conversation. While not overly excited, they're responding consistently and showing some interest in what you're saying.";
        } else {
            thoughts = "This person seems very interested in you! Their messages are enthusiastic, they ask follow-up questions, and they're actively keeping the conversation going.";
        }
        
        thoughtsContent.textContent = thoughts;
        
        // Generate mock replies
        const mockReplies = [
            "I've been thinking about what you said. You make a really good point, and I appreciate your perspective.",
            "That's interesting! I'd love to hear more about it when you have time.",
            "Thanks for sharing that with me. It actually reminds me of something I experienced recently."
        ];
        
        // Display replies
        repliesContainer.innerHTML = '';
        mockReplies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.innerHTML = `<p>${reply}</p>`;
            
            // Add copy functionality
            replyElement.addEventListener('click', () => {
                navigator.clipboard.writeText(reply)
                    .then(() => {
                        // Visual feedback
                        const allReplies = document.querySelectorAll('.reply');
                        allReplies.forEach(r => r.classList.remove('selected'));
                        replyElement.classList.add('selected');
                        
                        // Show copied toast
                        const toast = document.createElement('div');
                        toast.style.position = 'fixed';
                        toast.style.bottom = '20px';
                        toast.style.left = '50%';
                        toast.style.transform = 'translateX(-50%)';
                        toast.style.padding = '10px 20px';
                        toast.style.backgroundColor = '#333';
                        toast.style.color = 'white';
                        toast.style.borderRadius = '4px';
                        toast.style.opacity = '0';
                        toast.style.transition = 'opacity 0.3s';
                        toast.textContent = 'Copied to clipboard!';
                        
                        document.body.appendChild(toast);
                        setTimeout(() => toast.style.opacity = '1', 10);
                        setTimeout(() => {
                            toast.style.opacity = '0';
                            setTimeout(() => document.body.removeChild(toast), 300);
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            });
            
            repliesContainer.appendChild(replyElement);
        });
    }
}); 