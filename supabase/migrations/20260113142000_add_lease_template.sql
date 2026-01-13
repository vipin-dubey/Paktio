-- Add Residential Lease Agreement Template
-- First, try to remove existing one to avoid duplicates if re-running
DELETE FROM public.contracts 
WHERE title = 'Residential Lease Agreement' 
AND is_template = true 
AND org_id IS NULL;

INSERT INTO public.contracts (
    title,
    is_template,
    org_id,
    status,
    current_hash,
    content_json
) VALUES (
    'Residential Lease Agreement',
    true,
    NULL,
    'draft',
    'template-initial',
    '{
        "title": "Residential Lease Agreement",
        "party_roles": {
            "owner_label": "Landlord",
            "signer_label": "Tenant"
        },
        "blocks": [
            {"id": "b1", "type": "header", "content": "RESIDENTIAL LEASE AGREEMENT"},
            {"id": "b2", "type": "clause", "content": "THIS LEASE AGREEMENT (the \"Agreement\") is made and entered into this [Day] day of [Month], 2026, by and between:"},
            {"id": "b3", "type": "clause", "content": "LANDLORD: [Full Legal Name] Address for Notice: [Landlord’s Full Mailing Address] Phone/Email: [Landlord’s Contact Info]"},
            {"id": "b4", "type": "clause", "content": "TENANT(S): [Full Legal Name of Tenant 1], [Full Legal Name of Tenant 2] Phone/Email: [Tenant’s Contact Info]"},
            {"id": "b5", "type": "header", "content": "1. THE PREMISES"},
            {"id": "b6", "type": "clause", "content": "The Landlord agrees to rent to the Tenant the residential property located at: Address: [Street Address, Apartment Number, City, State, Zip Code]"},
            {"id": "b7", "type": "list", "content": "Included Features: The premises include [e.g., one parking space (Spot #12), a storage unit (Unit B), and the following appliances: Refrigerator, Stove, Dishwasher, Washer/Dryer]."},
            {"id": "b8", "type": "header", "content": "2. TERM OF LEASE"},
            {"id": "b9", "type": "clause", "content": "The term of this lease shall begin on [Start Date] and end on [End Date] at 11:59 PM."},
            {"id": "b10", "type": "clause", "content": "Renewal: Upon expiration, this Agreement shall not automatically renew unless a written amendment is signed by both parties. If the Tenant remains in possession after the term ends with the Landlord''s consent, the tenancy shall become month-to-month."},
            {"id": "b11", "type": "header", "content": "3. RENT PAYMENTS"},
            {"id": "b12", "type": "clause", "content": "Monthly Rent: The Tenant agrees to pay $[Amount] per month."},
            {"id": "b13", "type": "clause", "content": "Due Date: Rent is due on the 1st day of each calendar month."},
            {"id": "b14", "type": "clause", "content": "Payment Method: Payments shall be made via [e.g., Electronic Transfer, Zelle, Tenant Portal, or Check]."},
            {"id": "b15", "type": "clause", "content": "Late Fees: If rent is not received by the [Number]th day of the month, a late fee of $[Amount] (or [Percentage]% of the rent) shall be applied."},
            {"id": "b16", "type": "header", "content": "4. SECURITY DEPOSIT"},
            {"id": "b17", "type": "clause", "content": "Upon execution of this Agreement, the Tenant shall deposit the sum of $[Amount] with the Landlord."},
            {"id": "b18", "type": "clause", "content": "Purpose: This deposit serves as security for the performance of the Tenant’s obligations."},
            {"id": "b19", "type": "clause", "content": "Return: The deposit, minus any lawful deductions (for damages beyond normal wear and tear), will be returned to the Tenant within [Number, e.g., 30] days of move-out."},
            {"id": "b20", "type": "header", "content": "5. UTILITIES AND SERVICES"},
            {"id": "b21", "type": "clause", "content": "The responsibility for payment of utilities is distributed as follows:"},
            {"id": "b22", "type": "list", "content": "Electricity: Tenant"},
            {"id": "b23", "type": "list", "content": "Water & Sewer: Landlord"},
            {"id": "b24", "type": "list", "content": "Natural Gas: Tenant"},
            {"id": "b25", "type": "list", "content": "Trash Collection: Landlord"},
            {"id": "b26", "type": "list", "content": "Internet/Cable: Tenant"},
            {"id": "b27", "type": "header", "content": "6. USE OF PREMISES"},
            {"id": "b28", "type": "clause", "content": "Occupancy: The premises shall be used strictly as a private residence for the named Tenants and their minor children."},
            {"id": "b29", "type": "clause", "content": "Guests: Guests may stay for no more than [Number, e.g., 14] consecutive days without written consent from the Landlord."},
            {"id": "b30", "type": "clause", "content": "Commercial Use: No commercial or business activities that involve public foot traffic are permitted on the premises."},
            {"id": "b31", "type": "header", "content": "7. MAINTENANCE AND REPAIRS"},
            {"id": "b32", "type": "clause", "content": "Landlord’s Duties: Landlord shall maintain the structural integrity of the building, roof, plumbing, and heating/cooling systems."},
            {"id": "b33", "type": "clause", "content": "Tenant’s Duties: Tenant shall keep the premises clean and sanitary. Tenant is responsible for minor maintenance, such as replacing light bulbs and smoke detector batteries."},
            {"id": "b34", "type": "clause", "content": "Reporting: Tenant must immediately notify the Landlord of any leaks, mold, or mechanical failures. Failure to report may result in the Tenant being held liable for secondary damages."},
            {"id": "b35", "type": "header", "content": "8. ALTERATIONS AND IMPROVEMENTS"},
            {"id": "b36", "type": "clause", "content": "The Tenant shall make no alterations, installations (including satellite dishes), or painting to the premises without the prior written consent of the Landlord. Any unauthorized alterations may be restored to original condition at the Tenant''s expense."},
            {"id": "b37", "type": "header", "content": "9. PETS AND SMOKING"},
            {"id": "b38", "type": "clause", "content": "Pets: [ ] No pets allowed OR [ ] Pets allowed with a non-refundable pet fee of $[Amount]. (List specific pets: [Type/Breed])."},
            {"id": "b39", "type": "clause", "content": "Smoking: This is a 100% Non-Smoking property. This includes tobacco, cannabis, and vaping inside the unit or on balconies/common areas."},
            {"id": "b40", "type": "header", "content": "10. LANDLORD’S RIGHT OF ENTRY"},
            {"id": "b41", "type": "clause", "content": "The Landlord shall have the right to enter the premises for inspections, repairs, or showing the property to prospective tenants/buyers."},
            {"id": "b42", "type": "clause", "content": "Notice: Except in cases of emergency, the Landlord shall provide at least 24 hours’ notice before entry."},
            {"id": "b43", "type": "header", "content": "11. SUBLETTING AND ASSIGNMENT"},
            {"id": "b44", "type": "clause", "content": "The Tenant shall not sublet any part of the premises or assign this Agreement to another person without the express written consent of the Landlord."},
            {"id": "b45", "type": "header", "content": "12. DEFAULT AND TERMINATION"},
            {"id": "b46", "type": "clause", "content": "If the Tenant fails to pay rent or violates any material term of this Agreement, the Landlord may provide a notice to cure or quit. If the violation is not resolved within the legally required timeframe, the Landlord may terminate the lease and pursue eviction."},
            {"id": "b47", "type": "header", "content": "13. ABANDONMENT"},
            {"id": "b48", "type": "clause", "content": "If the Tenant is absent from the premises for more than [Number] consecutive days without notifying the Landlord while rent is unpaid, the Landlord may consider the property abandoned and take legal steps to reclaim possession."},
            {"id": "b49", "type": "header", "content": "14. GOVERNING LAW"},
            {"id": "b50", "type": "clause", "content": "This Agreement shall be governed by and construed in accordance with the laws of the State/Province of [State/Province Name]."},
            {"id": "b51", "type": "header", "content": "15. ADDITIONAL PROVISIONS / HOUSE RULES"},
            {"id": "b52", "type": "list", "content": "Noise: Quiet hours are observed from 10:00 PM to 8:00 AM."},
            {"id": "b53", "type": "list", "content": "Insurance: Tenant is strongly encouraged (or required) to maintain Renter’s Insurance for personal property and liability."},
            {"id": "b54", "type": "list", "content": "Keys: A fee of $[Amount] will be charged for lost keys or lockouts."}
        ]
    }'::jsonb
);
