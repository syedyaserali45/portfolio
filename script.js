document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year Update
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Sticky Header Scroll Effect
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. Dynamic Dark / Light Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // 4. Subtle Bento Card Hover Tilt (Micro-interaction)
    const cards = document.querySelectorAll('.bento-card');
    
    cards.forEach(card => {
        // Skip tilt on the modal overlay or modals
        if (card.classList.contains('project-modal')) return;
        
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 1.5;
            const rotateY = ((x - centerX) / centerX) * 1.5;
            
            card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 5. Interactive Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all and add to this
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('filtered-out');
                    // Trigger simple fade transition
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });

    // 6. Project Slide-Up Modal Drawer details data
    const projectData = {
        'proj-sales': {
            title: 'Sales Performance Dashboard',
            tags: 'POWER BI · EXCEL',
            description: 'An interactive sales intelligence platform built to monitor retail parameters across multiple regions. Built using Power BI DAX expressions for complex calculated measures, date intelligence, and key performance indicator metrics. Used Excel Power Query for data cleaning, pivoting, and schema shaping before ingestion.',
            metric1Val: '30–35%',
            metric1Lbl: 'Top Region Revenue Share',
            metric2Val: '12 Months',
            metric2Lbl: 'Time Intelligence Scope',
            linkCode: 'https://github.com/mr-syedyasirali',
            linkLive: 'https://github.com/mr-syedyasirali'
        },
        'proj-customer': {
            title: 'Customer Data Cleaning & Analysis',
            tags: 'SQL SERVER · EXCEL',
            description: 'Applied complex relational database management principles to eliminate system redundancies. Utilized SQL Server scripts to identify and handle null values, deduped repetitive transaction records, and standardized unstructured text fields. Leveraged window functions, GROUP BY, and JOIN aggregations to surface critical order-frequency and value patterns.',
            metric1Val: '5,000+',
            metric1Lbl: 'Customer Records Standardized',
            metric2Val: '100%',
            metric2Lbl: 'Data Deduplication Integrity',
            linkCode: 'https://github.com/mr-syedyasirali',
            linkLive: 'https://github.com/mr-syedyasirali'
        },
        'proj-hr': {
            title: 'HR Recruitment Analytics',
            tags: 'POWER BI · EXCEL',
            description: 'Designed a dashboard tracking recruitment flow across six hiring stages. Highlighted source-wise conversion metrics that pinpointed which pipelines yielded the highest ratios of successful hires. The resulting pipeline visualizations enable recruiting teams to adjust budget allocations toward high-ROI channels.',
            metric1Val: '6 Stages',
            metric1Lbl: 'Hiring Funnel Tracking',
            metric2Val: '50%+',
            metric2Lbl: 'Hires from Top Channel',
            linkCode: 'https://github.com/mr-syedyasirali',
            linkLive: 'https://github.com/mr-syedyasirali'
        },
        'proj-toxic': {
            title: 'Toxic Comment Classification',
            tags: 'PYTHON · NLP · MACHINE LEARNING',
            description: 'Built a natural language processing classification pipeline using Python Scikit-Learn. The system extracts TF-IDF vectors representing text frequencies and runs a calibrated Logistic Regression model to identify toxic content. Evaluated performance parameters using precision, recall, and F1-score to check prediction boundaries.',
            metric1Val: '10,000',
            metric1Lbl: 'Labeled Comments Processed',
            metric2Val: '~85%',
            metric2Lbl: 'F1 Classification Accuracy',
            linkCode: 'https://github.com/mr-syedyasirali',
            linkLive: 'https://github.com/mr-syedyasirali'
        }
    };

    const modal = document.getElementById('project-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    
    const mTags = document.getElementById('modal-tags');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-description');
    const mMetric1Val = document.getElementById('metric-1-val');
    const mMetric1Lbl = document.getElementById('metric-1-lbl');
    const mMetric2Val = document.getElementById('metric-2-val');
    const mMetric2Lbl = document.getElementById('metric-2-lbl');
    const mBtnLive = document.getElementById('modal-btn-live');
    const mBtnCode = document.getElementById('modal-btn-code');

    const openModal = (id) => {
        const data = projectData[id];
        if (!data) return;
        
        mTags.textContent = data.tags;
        mTitle.textContent = data.title;
        mDesc.textContent = data.description;
        mMetric1Val.textContent = data.metric1Val;
        mMetric1Lbl.textContent = data.metric1Lbl;
        mMetric2Val.textContent = data.metric2Val;
        mMetric2Lbl.textContent = data.metric2Lbl;
        mBtnLive.href = data.linkLive;
        mBtnCode.href = data.linkCode;
        
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scroll
    };

    // Attach click events to project bento cards
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent opening modal if the direct links or arrows inside cards are clicked
            if (e.target.closest('a') && e.target.closest('a').getAttribute('href') !== '#') {
                return;
            }
            const id = card.getAttribute('id');
            openModal(id);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 7. Smooth Anchor Link Scrolling with Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
