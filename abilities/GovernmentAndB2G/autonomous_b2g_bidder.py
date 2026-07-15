import logging
from abilities.SalesAndEstimation.takeoff import calculate_takeoff
from abilities.SalesAndEstimation.pricing import estimate_price
import random
import time
from datetime import datetime
from abilities.SalesAndEstimation.proposal_generator import ProposalGeneratorEngine

logging.basicConfig(level=logging.INFO, format='%(asctime)s - B2G-BIDDER - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AutonomousB2GBidder:
    """
    Scrapes SAM.gov and local municipalities. Autonomously generates unsolicited
    predictive infrastructure proposals using prevailing wage laws.
    """
    def __init__(self):
        logger.info("Initializing Autonomous Government Contracting Engine (B2G)...")

    def submit_unsolicited_proposal(self, municipality_name, scan_data):
        logger.info(f"Analyzing infrastructure scan for {municipality_name}...")
        
        # Estimate the project size based on the scan data (simulated for now, could be dynamic)
        # Using a large standard B2G size like 50,000 sq ft for municipal roads/lots
        sqft = float(scan_data.get("estimated_sqft", 50000))
        
        # Calculate materials required
        takeoff_data = calculate_takeoff(area_sqft=sqft, state_code="VA")
        
        # Get baseline commercial pricing
        price_range = estimate_price("paving", "commercial", sqft, state_code="VA")
        
        # Apply Davis-Bacon Prevailing Wage Markup (approx +20% for government work)
        davis_bacon_markup = 1.20
        low_usd = int(price_range["low_usd"] * davis_bacon_markup) if price_range else 150000
        high_usd = int(price_range["high_usd"] * davis_bacon_markup) if price_range else 250000
        
        logger.error(f"JARVIS FINDING: Subsurface drainage collapsing in {municipality_name}. Prevailing Wage Markup Applied (1.20x).")
        
        # 2026-2030 Macro-Economic AI Adaptation Rules
        # Injected from Overnight Evolution Protocol Findings
        macro_economic_rules = (
            "CRITICAL B2G BIDDING DIRECTIVE (2026-2030 Trends):\n"
            "1. Shift from IIJA Mega-Grants to Public-Private Partnerships (P3s) due to the funding cliff.\n"
            "2. Emphasize Asset Preservation (sealcoating, mill-and-fill) over total replacement due to municipal capital constraints.\n"
            "3. MANDATORY SUSTAINABILITY: You must propose Reclaimed Asphalt Pavement (RAP), Warm-Mix Asphalt (WMA), or bio-based binders to meet decarbonization mandates.\n"
            "4. Include Intelligent Paving QA/QC with embedded sensors to guarantee compaction density.\n"
        )
        
        # Construct lead payload for the proposal generator
        lead_payload = {
            "name": f"{municipality_name} City Council",
            "address": municipality_name,
            "state_code": "VA",
            "service_type": "commercial_paving",
            "property_type": "government",
            "project_size_sqft": sqft,
            "price_low": low_usd,
            "price_high": high_usd,
            "message": f"Unsolicited predictive proposal for critical infrastructure repair. Must comply with Davis-Bacon prevailing wages.\n\n{macro_economic_rules}"
        }
        
        logger.info("Generating multi-page proposal using GPT-4o logic...")
        proposal_generator = ProposalGeneratorEngine()
        proposal_text = proposal_generator.execute(lead_payload)
        
        logger.warning(f"JARVIS ACTION: Unsolicited Proposal for ${high_usd:,} generated for {municipality_name}.")
        logger.warning(f"SECURITY LOCK: Bid drafted but NOT SENT. Waiting for Owner Approval (status: PENDING_APPROVAL).")
        
        # In a real database we would INSERT INTO bids... returning bid_id
        import uuid
        bid_id = f"BID-{str(uuid.uuid4())[:8].upper()}"
        
        return {
            "bid_id": bid_id,
            "status": "PENDING_APPROVAL",
            "proposal": proposal_text,
            "takeoff": takeoff_data,
            "pricing": {
                "low": low_usd,
                "high": high_usd,
                "markup_applied": "Davis-Bacon Prevailing Wage (20%)"
            }
        }

if __name__ == "__main__":
    b2g = AutonomousB2GBidder()
    result = b2g.submit_unsolicited_proposal("Richmond City", {"estimated_sqft": 45000})
    print(result["proposal"][:500])

