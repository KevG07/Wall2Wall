// ============================================
// Globe Visualization using D3.js
// Van der Grinten IV Projection with Dynamic Glow Spots
// ============================================

let globeState = {
    isExpanded: false,
    glowIntervalId: null,
    glowSpots: [],
    projection: null,
    geoGenerator: null,
    worldData: null,
    svg: null
};

// Geographic coordinates of continents and landmasses (approximate land areas)
// These coordinates represent major land regions where glow spots can appear
const LAND_REGIONS = [
    // North America
    { lat: 45, lng: -100 }, { lat: 35, lng: -95 }, { lat: 40, lng: -110 },
    { lat: 50, lng: -120 }, { lat: 25, lng: -80 },
    // South America
    { lat: -10, lng: -60 }, { lat: -20, lng: -65 }, { lat: 0, lng: -75 },
    // Europe
    { lat: 55, lng: 10 }, { lat: 50, lng: 5 }, { lat: 45, lng: 15 },
    // Africa
    { lat: 0, lng: 20 }, { lat: -10, lng: 25 }, { lat: 15, lng: 5 },
    { lat: -30, lng: 22 },
    // Asia
    { lat: 50, lng: 100 }, { lat: 35, lng: 105 }, { lat: 20, lng: 80 },
    { lat: 0, lng: 110 }, { lat: 30, lng: 120 },
    // Australia
    { lat: -25, lng: 133 },
    // Additional regions
    { lat: 60, lng: 30 }, // Russia
    { lat: 10, lng: 35 }, // Central Africa
    { lat: -15, lng: 135 }, // Northern Australia
    { lat: 5, lng: 95 }, // Southeast Asia
    { lat: 40, lng: 50 }, // Middle East
];

/**
 * Initialize the globe visualization
 */
function initializeGlobe() {
    const svgElement = document.getElementById('globe-svg');
    const container = document.querySelector('.globe-container');
    
    if (!svgElement || !container) {
        console.error('Globe container or SVG element not found');
        return;
    }

    // Get container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set SVG dimensions
    svgElement.setAttribute('width', width);
    svgElement.setAttribute('height', height);

    // Create D3 selection
    globeState.svg = d3.select(svgElement);

    // Van der Grinten IV Projection
    // Using a custom projection based on Van der Grinten principles
    globeState.projection = d3.geoVanDerGrinten()
        .scale(width / 1.8 / Math.PI)
        .translate([width / 2, height / 2]);

    // Create path generator for geographic features
    globeState.geoGenerator = d3.geoPath().projection(globeState.projection);

    // Load world geographic data from a remote source
    loadWorldData();
}

/**
 * Load world geographic data
 */
function loadWorldData() {
    // Using a reliable TopoJSON source for world data
    const dataUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
    
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            globeState.worldData = data;
            drawGlobe();
            startGlowAnimation();
            hideLoadingIndicator();
        })
        .catch(error => {
            console.error('Error loading world data:', error);
            showLoadingError();
        });
}

/**
 * Draw the globe with landmasses
 */
function drawGlobe() {
    if (!globeState.worldData || !globeState.svg) return;

    const svg = globeState.svg;
    const land = topojson.feature(globeState.worldData, globeState.worldData.objects.countries);

    // Draw background sphere
    svg.append('circle')
        .attr('class', 'globe-sphere')
        .attr('cx', globeState.projection([0, 0])[0])
        .attr('cy', globeState.projection([0, 0])[1])
        .attr('r', globeState.projection([0, 90])[1] - globeState.projection([0, 0])[1])
        .attr('fill', '#0a1628')
        .attr('opacity', 0.5);

    // Draw landmasses
    svg.append('g')
        .attr('class', 'land-group')
        .selectAll('path')
        .data(land.features)
        .enter()
        .append('path')
        .attr('class', 'globe-land')
        .attr('d', globeState.geoGenerator);

    // Draw graticule (grid lines)
    const graticule = d3.geoGraticule();
    svg.append('path')
        .attr('class', 'globe-graticule')
        .attr('d', globeState.geoGenerator(graticule()));

    console.log('Globe rendered successfully');
}

/**
 * Start the animation of random glow spots
 */
function startGlowAnimation() {
    // Clear any existing interval
    if (globeState.glowIntervalId) {
        clearInterval(globeState.glowIntervalId);
    }

    // Initial glow spots
    addRandomGlowSpots(5);

    // Add new glow spots every 3-5 seconds (medium speed)
    globeState.glowIntervalId = setInterval(() => {
        addRandomGlowSpots(1);
        removeOldGlowSpots();
    }, 4000); // 4 seconds = medium speed
}

/**
 * Add random glow spots to the globe
 * @param {number} count - Number of spots to add
 */
function addRandomGlowSpots(count) {
    const svg = globeState.svg;
    if (!svg || !globeState.geoGenerator) return;

    for (let i = 0; i < count; i++) {
        // Pick a random land region
        const region = LAND_REGIONS[Math.floor(Math.random() * LAND_REGIONS.length)];
        
        // Add slight randomness to the exact position
        const lat = region.lat + (Math.random() - 0.5) * 10;
        const lng = region.lng + (Math.random() - 0.5) * 10;
        
        // Clamp to valid ranges
        const clampedLat = Math.max(-85, Math.min(85, lat));
        const clampedLng = lng % 360;

        const coords = [clampedLng, clampedLat];
        const projected = globeState.projection(coords);

        if (projected && isFinite(projected[0]) && isFinite(projected[1])) {
            const spotId = `glow-spot-${Date.now()}-${i}`;
            const spotGroup = svg.append('g')
                .attr('class', 'glow-spot')
                .attr('id', spotId)
                .attr('data-timestamp', Date.now());

            // Glow circle (outer ring)
            spotGroup.append('circle')
                .attr('class', 'glow-circle')
                .attr('cx', projected[0])
                .attr('cy', projected[1])
                .attr('r', 8);

            // Glow point (center)
            spotGroup.append('circle')
                .attr('class', 'glow-point pulse')
                .attr('cx', projected[0])
                .attr('cy', projected[1])
                .attr('r', 3);

            // Add to tracking array
            globeState.glowSpots.push({
                id: spotId,
                timestamp: Date.now()
            });

            console.log(`Added glow spot at ${coords}`);
        }
    }
}

/**
 * Remove glow spots that are older than 10 seconds
 */
function removeOldGlowSpots() {
    const now = Date.now();
    const maxAge = 10000; // 10 seconds

    globeState.glowSpots = globeState.glowSpots.filter(spot => {
        if (now - spot.timestamp > maxAge) {
            // Remove from DOM
            const element = document.getElementById(spot.id);
            if (element) {
                d3.select(`#${spot.id}`)
                    .transition()
                    .duration(500)
                    .style('opacity', 0)
                    .remove();
            }
            return false; // Remove from array
        }
        return true; // Keep in array
    });
}

/**
 * Stop the glow animation
 */
function stopGlowAnimation() {
    if (globeState.glowIntervalId) {
        clearInterval(globeState.glowIntervalId);
        globeState.glowIntervalId = null;
    }
}

/**
 * Clear all glow spots from the globe
 */
function clearGlowSpots() {
    globeState.svg.selectAll('.glow-spot').remove();
    globeState.glowSpots = [];
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
    const loadingElement = document.getElementById('globeLoading');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

/**
 * Show loading error message
 */
function showLoadingError() {
    const loadingElement = document.getElementById('globeLoading');
    if (loadingElement) {
        loadingElement.innerHTML = '<p>Error loading map. Please try again.</p>';
    }
}

/**
 * Expand or collapse the globe section
 */
function toggleGlobeSection() {
    const globeSection = document.getElementById('globeSection');
    
    if (!globeSection) return;

    if (globeState.isExpanded) {
        // Collapse
        globeSection.classList.remove('expanded');
        stopGlowAnimation();
        clearGlowSpots();
        globeState.isExpanded = false;
    } else {
        // Expand
        if (!globeState.svg) {
            initializeGlobe();
        }
        globeSection.classList.add('expanded');
        startGlowAnimation();
        globeState.isExpanded = true;
    }
}

/**
 * Handle window resize to redraw globe
 */
function handleWindowResize() {
    if (globeState.isExpanded && globeState.svg) {
        const container = document.querySelector('.globe-container');
        const svgElement = document.getElementById('globe-svg');
        
        if (container && svgElement) {
            const width = container.clientWidth;
            const height = container.clientHeight;

            svgElement.setAttribute('width', width);
            svgElement.setAttribute('height', height);

            // Update projection scale and translate
            globeState.projection
                .scale(width / 1.8 / Math.PI)
                .translate([width / 2, height / 2]);

            // Redraw globe
            globeState.svg.selectAll('*').remove();
            drawGlobe();
        }
    }
}

// ============================================
// Event Listeners & Initialization
// ============================================

// Initialize globe when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const globeToggle = document.getElementById('globeToggle');
    
    if (globeToggle) {
        globeToggle.addEventListener('click', toggleGlobeSection);
    }
});

// Handle window resize
window.addEventListener('resize', handleWindowResize);

console.log('Globe.js loaded successfully');
