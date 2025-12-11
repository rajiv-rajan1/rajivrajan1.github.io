// DOM Elements
const form = document.getElementById('kcetForm');
const pcmMarksInput = document.getElementById('pcmMarks');
const kcetMarksInput = document.getElementById('kcetMarks');
const categorySelect = document.getElementById('category');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('results');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const suggestionsContent = document.getElementById('suggestionsContent');
const suggestionsPlaceholder = document.getElementById('suggestionsPlaceholder');
const analysisCard = document.getElementById('analysisCard');
const suggestionsCard = document.getElementById('suggestionsCard');

// Error message elements
const pcmError = document.getElementById('pcmError');
const kcetError = document.getElementById('kcetError');

// Result display elements
const pcmPercentageDisplay = document.getElementById('pcmPercentage');
const kcetPercentageDisplay = document.getElementById('kcetPercentage');
const compositeScoreDisplay = document.getElementById('compositeScore');
const selectedCategoryDisplay = document.getElementById('selectedCategory');
const historicalResultsGrid = document.getElementById('historicalResultsGrid');
const pcmLiveFeedback = document.getElementById('pcmLiveFeedback');
const kcetLiveFeedback = document.getElementById('kcetLiveFeedback');

// Historical Data Constants (Topper Scores & Rank Lookups)
const HISTORICAL_DATA = {
    2024: {
        topperScore: 98.75, // Estimated roughly based on research
        rankLookup: [
            { score: 98, rank: 10 },
            { score: 95, rank: 50 },
            { score: 90, rank: 200 },
            { score: 85, rank: 1000 },
            { score: 80, rank: 2500 },
            { score: 70, rank: 6000 },
            { score: 60, rank: 15000 },
            { score: 50, rank: 35000 }
        ]
    },
    2023: {
        topperScore: 97.89, // Vignesh Nataraj Kumar
        rankLookup: [
            { score: 97, rank: 10 },
            { score: 94, rank: 100 },
            { score: 89, rank: 500 },
            { score: 83, rank: 2000 },
            { score: 75, rank: 5000 },
            { score: 65, rank: 12000 },
            { score: 55, rank: 25000 },
            { score: 45, rank: 50000 }
        ]
    },
    2022: {
        topperScore: 98.61, // Apoorv Tandon
        rankLookup: [
            { score: 98, rank: 10 },
            { score: 95, rank: 50 },
            { score: 90, rank: 300 },
            { score: 85, rank: 1200 },
            { score: 78, rank: 3500 },
            { score: 68, rank: 9000 },
            { score: 58, rank: 18000 },
            { score: 48, rank: 40000 }
        ]
    }
};

// College Cutoff Data (Based on ~2024 GM Ranks)
const COLLEGE_DATA = [
    {
        name: "RV College of Engineering",
        code: "RVCE",
        cutoffs: {
            CSE: 300,
            ISE: 500,
            AIML: 550,
            ECE: 800,
            EEE: 1200,
            MECH: 4000
        }
    },
    {
        name: "PES University (RR Campus)",
        code: "PESU",
        cutoffs: {
            CSE: 950,
            AIML: 2600,
            ECE: 3100,
            EEE: 5100,
            BT: 6200
        }
    },
    {
        name: "BMS College of Engineering",
        code: "BMSCE",
        cutoffs: {
            CSE: 1000,
            ISE: 1500, // Est
            ECE: 1900,
            AIML: 2500,
            MECH: 9000
        }
    },
    {
        name: "MS Ramaiah Institute of Technology",
        code: "MSRIT",
        cutoffs: {
            CSE: 1300,
            AIML: 2300,
            ISE: 3100,
            ECE: 4600,
            MECH: 11000
        }
    },
    {
        name: "Bangalore Institute of Technology",
        code: "BIT",
        cutoffs: {
            CSE: 5600,
            AIML: 6200,
            ISE: 7400,
            ECE: 9500,
            MECH: 50000
        }
    }
];

// Validation functions
function validatePCMMarks(marks) {
    const value = parseFloat(marks);

    if (isNaN(value)) {
        return { valid: false, message: 'Please enter a valid number' };
    }

    if (value < 0) {
        return { valid: false, message: 'Marks cannot be negative' };
    }

    if (value > 300) {
        return { valid: false, message: 'Marks cannot exceed 300' };
    }

    return { valid: true, message: '' };
}

function validateKCETMarks(marks) {
    const value = parseFloat(marks);

    if (isNaN(value)) {
        return { valid: false, message: 'Please enter a valid number' };
    }

    if (value < 0) {
        return { valid: false, message: 'Marks cannot be negative' };
    }

    if (value > 180) {
        return { valid: false, message: 'Marks cannot exceed 180' };
    }

    return { valid: true, message: '' };
}

function validateCategory(category) {
    if (!category || category === '') {
        return { valid: false, message: 'Please select a category' };
    }

    return { valid: true, message: '' };
}

// Real-time validation
pcmMarksInput.addEventListener('input', function () {
    const validation = validatePCMMarks(this.value);
    pcmError.textContent = validation.message;

    if (!validation.valid) {
        this.style.borderColor = 'var(--color-error)';
        pcmLiveFeedback.classList.remove('visible');
    } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';

        // Calculate and show live percentage
        const marks = parseFloat(this.value);
        if (!isNaN(marks) && marks >= 0 && marks <= 300 && this.value !== '') {
            const percentage = ((marks / 300) * 100).toFixed(2);
            pcmLiveFeedback.textContent = `${percentage}%`;
            pcmLiveFeedback.classList.add('visible');
        } else {
            pcmLiveFeedback.classList.remove('visible');
        }
    }
});

kcetMarksInput.addEventListener('input', function () {
    const validation = validateKCETMarks(this.value);
    kcetError.textContent = validation.message;

    if (!validation.valid) {
        this.style.borderColor = 'var(--color-error)';
        kcetLiveFeedback.classList.remove('visible');
    } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';

        // Calculate and show live percentage
        const marks = parseFloat(this.value);
        if (!isNaN(marks) && marks >= 0 && marks <= 180 && this.value !== '') {
            const percentage = ((marks / 180) * 100).toFixed(2);
            kcetLiveFeedback.textContent = `${percentage}%`;
            kcetLiveFeedback.classList.add('visible');
        } else {
            kcetLiveFeedback.classList.remove('visible');
        }
    }
});

// Calculate KCET ranking
function calculateRanking(pcmMarks, kcetMarks, category) {
    // Calculate percentages
    const pcmPercentage = (pcmMarks / 300) * 100;
    const kcetPercentage = (kcetMarks / 180) * 100;

    // Calculate composite score using 50:50 weightage
    const compositeScore = (pcmPercentage + kcetPercentage) / 2;

    // Calculate historical ranks
    const historicalRanks = calculateHistoricalRanks(compositeScore);

    return {
        pcmPercentage: pcmPercentage.toFixed(2),
        kcetPercentage: kcetPercentage.toFixed(2),
        compositeScore: compositeScore.toFixed(2),
        category: category,
        historical: historicalRanks
    };
}

function calculateHistoricalRanks(userCompositeScore) {
    const years = [2024, 2023, 2022];
    const results = {};

    years.forEach(year => {
        const yearData = HISTORICAL_DATA[year];

        // 1. Calculate Percentile Relative to Topper
        const topperPercentile = (userCompositeScore / yearData.topperScore) * 100;

        // 2. Estimate Rank using Piecewise Linear Interpolation
        let estimatedRank = '> 50000';
        const lookup = yearData.rankLookup;

        // Handle cases better than topper (unlikely but possible with different weightage logic interpretation)
        if (userCompositeScore >= lookup[0].score) {
            estimatedRank = 'Top 10';
        } else {
            for (let i = 0; i < lookup.length - 1; i++) {
                const upper = lookup[i];
                const lower = lookup[i + 1];

                if (userCompositeScore <= upper.score && userCompositeScore > lower.score) {
                    // Linear interpolation formula: 
                    // Y = Y1 + (X - X1) * ((Y2 - Y1) / (X2 - X1))
                    // X = Score, Y = Rank
                    // Note: Rank increases as Score decreases, so slope is negative

                    const scoreRange = upper.score - lower.score;
                    const rankRange = lower.rank - upper.rank;
                    const scoreDiff = upper.score - userCompositeScore;
                    const rankDiff = (scoreDiff / scoreRange) * rankRange;

                    estimatedRank = Math.round(upper.rank + rankDiff);
                    break;
                }
            }
        }

        results[year] = {
            rank: estimatedRank,
            topperPercentile: Math.min(topperPercentile, 100).toFixed(2)
        };
    });

    return results;
}

function getCollegeSuggestions(rank, category) {
    // Basic category multiplier for cutoff relaxation
    // (GM = 1, others get slightly relaxed ranks for estimation)
    let multiplier = 1.0;
    if (category === 'OBC') multiplier = 1.2;
    else if (category === 'SC') multiplier = 2.5;
    else if (category === 'ST') multiplier = 3.0;

    const suggestions = [];

    COLLEGE_DATA.forEach(college => {
        const eligibleStreams = [];

        for (const [stream, cutoff] of Object.entries(college.cutoffs)) {
            const effectiveCutoff = cutoff * multiplier;

            // Check if user rank is within reasonable range of cutoff
            // (e.g. if rank is 1000 and cutoff is 1200 -> High Chance)
            // (e.g. if rank is 1300 and cutoff is 1200 -> Borderline)

            if (rank <= effectiveCutoff) {
                eligibleStreams.push({ name: stream, chance: 'High', cutoff: Math.floor(effectiveCutoff) });
            } else if (rank <= effectiveCutoff * 1.15) {
                eligibleStreams.push({ name: stream, chance: 'Moderate', cutoff: Math.floor(effectiveCutoff) });
            } else if (rank <= effectiveCutoff * 1.5) {
                eligibleStreams.push({ name: stream, chance: 'Low', cutoff: Math.floor(effectiveCutoff) });
            }
        }

        if (eligibleStreams.length > 0) {
            suggestions.push({
                name: college.name,
                code: college.code,
                streams: eligibleStreams
            });
        }
    });

    return suggestions;
}

// Display results
function displayResults(results) {
    // Update result values
    pcmPercentageDisplay.textContent = `${results.pcmPercentage}%`;
    kcetPercentageDisplay.textContent = `${results.kcetPercentage}%`;
    compositeScoreDisplay.textContent = `${results.compositeScore}%`;
    selectedCategoryDisplay.textContent = results.category;

    // Render Historical Results
    renderHistoricalResults(results.historical);

    // Render College Suggestions
    // Use estimates from the most recent year (2024) for the suggestion engine
    const estimatedCurrentRank = typeof results.historical[2024].rank === 'number' ? results.historical[2024].rank : 100000;
    const suggestions = getCollegeSuggestions(estimatedCurrentRank, results.category);
    renderCollegeSuggestions(suggestions);

    // Toggle visibility logic
    // Hide placeholders
    if (resultsPlaceholder) resultsPlaceholder.style.display = 'none';
    if (suggestionsPlaceholder) suggestionsPlaceholder.style.display = 'none';

    // Show contents
    resultsSection.classList.remove('hidden');
    if (suggestionsContent) suggestionsContent.classList.remove('hidden');

    // Smooth scroll if needed
    if (window.innerWidth <= 850) {
        analysisCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function renderCollegeSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('collegeSuggestionsGrid');
    if (!suggestionsContainer) return; // Guard clause

    suggestionsContainer.innerHTML = '';

    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div class="no-suggestions">Your rank is outside the range for the top 5 colleges list. Consider other institutions!</div>';
        return;
    }

    suggestions.forEach(college => {
        const card = document.createElement('div');
        card.className = 'college-card';

        let streamsHtml = '';
        college.streams.forEach(stream => {
            const chanceClass = stream.chance.toLowerCase();
            streamsHtml += `
                <div class="stream-item ${chanceClass}">
                    <span class="stream-name">${stream.name}</span>
                    <span class="stream-chance">${stream.chance}</span>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="college-header">
                <span class="college-code">${college.code}</span>
                <h4 class="college-name">${college.name}</h4>
            </div>
            <div class="college-streams">
                ${streamsHtml}
            </div>
        `;

        suggestionsContainer.appendChild(card);
    });
}

function renderHistoricalResults(historicalData) {
    historicalResultsGrid.innerHTML = ''; // Clear previous

    Object.keys(historicalData).sort((a, b) => b - a).forEach(year => {
        const data = historicalData[year];

        const card = document.createElement('div');
        card.className = 'historical-card';
        card.innerHTML = `
            <div class="hist-year">${year}</div>
            <div class="hist-rank-label">Est. Rank</div>
            <div class="hist-rank-value">#${data.rank}</div>
            <div class="hist-bar-container">
                <div class="hist-bar-fill" style="width: ${data.topperPercentile}%"></div>
            </div>
            <div class="hist-percentile">${data.topperPercentile}% of Topper</div>
        `;

        historicalResultsGrid.appendChild(card);
    });
}

// Form submission handler
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const pcmMarks = pcmMarksInput.value.trim();
    const kcetMarks = kcetMarksInput.value.trim();
    const category = categorySelect.value;

    // Validate all inputs
    const pcmValidation = validatePCMMarks(pcmMarks);
    const kcetValidation = validateKCETMarks(kcetMarks);
    const categoryValidation = validateCategory(category);

    // Display error messages
    pcmError.textContent = pcmValidation.message;
    kcetError.textContent = kcetValidation.message;

    // Update input border colors
    if (!pcmValidation.valid) {
        pcmMarksInput.style.borderColor = 'var(--color-error)';
    } else {
        pcmMarksInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }

    if (!kcetValidation.valid) {
        kcetMarksInput.style.borderColor = 'var(--color-error)';
    } else {
        kcetMarksInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }

    if (!categoryValidation.valid) {
        categorySelect.style.borderColor = 'var(--color-error)';
        return;
    } else {
        categorySelect.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }

    // Check if all validations passed
    if (!pcmValidation.valid || !kcetValidation.valid || !categoryValidation.valid) {
        return;
    }

    // Calculate and display results
    const results = calculateRanking(
        parseFloat(pcmMarks),
        parseFloat(kcetMarks),
        category
    );

    displayResults(results);
});

// Reset button handler
// Reset button handler
resetBtn.addEventListener('click', function () {
    // Hide results contents
    resultsSection.classList.add('hidden');
    if (suggestionsContent) suggestionsContent.classList.add('hidden');

    // Show placeholders
    if (resultsPlaceholder) resultsPlaceholder.style.display = 'flex';
    if (suggestionsPlaceholder) suggestionsPlaceholder.style.display = 'flex';

    // Reset form
    form.reset();

    // Clear live feedback
    pcmLiveFeedback.textContent = '';
    pcmLiveFeedback.classList.remove('visible');
    kcetLiveFeedback.textContent = '';
    kcetLiveFeedback.classList.remove('visible');

    // Clear error messages
    pcmError.textContent = '';
    kcetError.textContent = '';

    // Reset input border colors
    pcmMarksInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    kcetMarksInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    categorySelect.style.borderColor = 'rgba(255, 255, 255, 0.1)';
});

// Prevent form submission on Enter key in input fields (optional UX enhancement)
pcmMarksInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        kcetMarksInput.focus();
    }
});

kcetMarksInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        categorySelect.focus();
    }
});

// Add smooth focus transitions
const inputs = [pcmMarksInput, kcetMarksInput, categorySelect];
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.style.transform = 'scale(1.01)';
    });

    input.addEventListener('blur', function () {
        this.style.transform = 'scale(1)';
    });
});
