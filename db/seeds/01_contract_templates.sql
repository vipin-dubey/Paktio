-- Seed file for Common Contract Templates

-- 1. Mutual Non-Disclosure Agreement (NDA)
INSERT INTO contracts (
    id,
    title,
    content_json,
    status,
    version,
    is_template,
    created_at,
    updated_at,
    org_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Mutual Non-Disclosure Agreement',
    '{
        "title": "Mutual Non-Disclosure Agreement",
        "legal_context": "This Agreement is entered into between two parties to protect confidential information shared during business discussions.",
        "blocks": [
            {
                "id": "header_1",
                "type": "header",
                "content": "Mutual Non-Disclosure Agreement"
            },
            {
                "id": "clause_1",
                "type": "clause",
                "content": "This Non-Disclosure Agreement (the \"Agreement\") is entered into by and between the parties identified below (collectively, the \"Parties\"). The Parties wish to explore a business opportunity of mutual interest and in connection with this opportunity, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential."
            },
            {
                "id": "header_2",
                "type": "header",
                "content": "1. Confidential Information"
            },
            {
                "id": "clause_2",
                "type": "clause",
                "content": "\"Confidential Information\" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects (including without limitation documents, prototypes, samples, plant and equipment), which is designated as \"Confidential,\" \"Proprietary\" or some similar designation."
            },
            {
                "id": "header_3",
                "type": "header",
                "content": "2. Non-use and Non-disclosure"
            },
            {
                "id": "clause_3",
                "type": "clause",
                "content": "Each party agrees not to use any Confidential Information of the other party for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties. Each party agrees not to disclose any Confidential Information of the other party to third parties or to such party''s employees, except to those employees of the receiving party who are required to have the information into order to evaluate or engage in discussions concerning the contemplated business relationship."
            },
            {
                "id": "header_4",
                "type": "header",
                "content": "3. Maintenance of Confidentiality"
            },
            {
                "id": "clause_4",
                "type": "clause",
                "content": "Each party agrees that it shall take reasonable measures to protect the secrecy of and avoid disclosure and unauthorized use of the Confidential Information of the other party. Without limiting the foregoing, each party shall take at least those measures that it takes to protect its own most highly confidential information and shall ensure that its employees who have access to Confidential Information of the other party have signed a non-use and non-disclosure agreement in content similar to the provisions hereof."
            },
            {
                "id": "footer_1",
                "type": "footer",
                "content": "This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the Disclosing Party resides."
            }
        ]
    }',
    'draft',
    1,
    true,
    NOW(),
    NOW(),
    NULL
);

-- 2. Freelance Independent Contractor Agreement
INSERT INTO contracts (
    id,
    title,
    content_json,
    status,
    version,
    is_template,
    created_at,
    updated_at,
    org_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'Independent Contractor Agreement',
    '{
        "title": "Independent Contractor Agreement",
        "legal_context": "Agreement between a Client and an Independent Contractor for services rendered.",
        "blocks": [
            {
                "id": "header_1",
                "type": "header",
                "content": "Independent Contractor Agreement"
            },
            {
                "id": "clause_1",
                "type": "clause",
                "content": "This Independent Contractor Agreement (the \"Agreement\") is made and entered into between the Client and the Contractor (collectively, the \"Parties\")."
            },
            {
                "id": "header_2",
                "type": "header",
                "content": "1. Services to be Performed"
            },
            {
                "id": "clause_2",
                "type": "clause",
                "content": "Contractor agrees to perform the services described in the attached Statement of Work or as otherwise mutually agreed upon by the Parties (the \"Services\"). Contractor agrees to perform the Services in a professional and workmanlike manner."
            },
            {
                "id": "header_3",
                "type": "header",
                "content": "2. Payment"
            },
            {
                "id": "clause_3",
                "type": "clause",
                "content": "In consideration for the Services to be performed by Contractor, Client agrees to pay Contractor at the rate and in the manner specified in the Statement of Work."
            },
            {
                "id": "header_4",
                "type": "header",
                "content": "3. Independent Contractor Status"
            },
            {
                "id": "clause_4",
                "type": "clause",
                "content": "Contractor acts as an independent contractor. Nothing contained in this Agreement shall be deemed to constitute a partnership or joint venture between the Client and Contractor. Contractor is responsible for paying all federal and state taxes with respect to compensation paid to Contractor."
            },
            {
                "id": "header_5",
                "type": "header",
                "content": "4. Intellectual Property"
            },
            {
                "id": "clause_5",
                "type": "clause",
                "content": "Contractor agrees that any work product produced in the performance of this Agreement shall remain the sole and exclusive property of Client, including all intellectual property rights."
            },
             {
                "id": "footer_1",
                "type": "footer",
                "content": "This Agreement constitutes the entire agreement between the parties."
            }
        ]
    }',
    'draft',
    1,
    true,
    NOW(),
    NOW(),
    NULL
);

-- 3. Residential Lease Agreement
INSERT INTO contracts (
    id,
    title,
    content_json,
    status,
    version,
    is_template,
    created_at,
    updated_at,
    org_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'Residential Lease Agreement',
    '{
        "title": "Residential Lease Agreement",
        "legal_context": "Lease contract for a residential property between a Landlord and a Tenant.",
        "blocks": [
            {
                "id": "header_1",
                "type": "header",
                "content": "Residential Lease Agreement"
            },
            {
                "id": "clause_1",
                "type": "clause",
                "content": "This Lease Agreement (the \"Lease\") is made by and between the Landlord and the Tenant (collectively, the \"Parties\")."
            },
            {
                "id": "header_2",
                "type": "header",
                "content": "1. Property"
            },
            {
                "id": "clause_2",
                "type": "clause",
                "content": "Landlord agrees to lease to Tenant, and Tenant agrees to lease from Landlord, the residential property located at the address provided in the specific terms (the \"Premises\")."
            },
            {
                "id": "header_3",
                "type": "header",
                "content": "2. Term"
            },
            {
                "id": "clause_3",
                "type": "clause",
                "content": "The term of this Lease shall commence on the Start Date and continue until the End Date, unless sooner terminated in accordance with the provisions of this Lease."
            },
            {
                "id": "header_4",
                "type": "header",
                "content": "3. Rent"
            },
            {
                "id": "clause_4",
                "type": "clause",
                "content": "Tenant agrees to pay Landlord rent in the amount agreed upon, payable in advance on the first day of each month."
            },
            {
                "id": "header_5",
                "type": "header",
                "content": "4. Security Deposit"
            },
            {
                "id": "clause_5",
                "type": "clause",
                "content": "On execution of this Lease, Tenant deposits with Landlord a security deposit to perform Tenant''s obligations under this Lease. Landlord may use the security deposit to cover any unpaid rent or damages to the Premises beyond normal wear and tear."
            },
            {
                "id": "footer_1",
                "type": "footer",
                "content": "The Parties agree to all terms and conditions of this Lease."
            }
        ]
    }',
    'draft',
    1,
    true,
    NOW(),
    NOW(),
    NULL
);

-- 4. Personal Loan Agreement
INSERT INTO contracts (
    id,
    title,
    content_json,
    status,
    version,
    is_template,
    created_at,
    updated_at,
    org_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    'Personal Loan Agreement',
    '{
        "title": "Personal Loan Agreement",
        "legal_context": "Agreement for a loan between two individuals.",
        "blocks": [
            {
                "id": "header_1",
                "type": "header",
                "content": "Personal Loan Agreement"
            },
            {
                "id": "clause_1",
                "type": "clause",
                "content": "This Loan Agreement (the \"Agreement\") is made between the Lender and the Borrower."
            },
            {
                "id": "header_2",
                "type": "header",
                "content": "1. Loan Amount and Distribution"
            },
            {
                "id": "clause_2",
                "type": "clause",
                "content": "The Lender agrees to loan the Borrower the principal sum agreed upon (the \"Loan\"). The Loan will be delivered to the Borrower on the Start Date."
            },
            {
                "id": "header_3",
                "type": "header",
                "content": "2. Repayment"
            },
            {
                "id": "clause_3",
                "type": "clause",
                "content": "The Borrower agrees to repay the Loan to the Lender according to the repayment schedule agreed upon by the Parties. Repayment shall include any accrued interest."
            },
            {
                "id": "header_4",
                "type": "header",
                "content": "3. Interest"
            },
            {
                "id": "clause_4",
                "type": "clause",
                "content": "The Loan shall bear interest at an annual rate as agreed upon, calculated simply on the unpaid principal balance."
            },
            {
                "id": "header_5",
                "type": "header",
                "content": "4. Default"
            },
            {
                "id": "clause_5",
                "type": "clause",
                "content": "If the Borrower fails to make any payment when due, the Borrower shall be in default. In the event of default, the Lender may declare the entire unpaid principal and accrued interest immediately due and payable."
            },
            {
                "id": "footer_1",
                "type": "footer",
                "content": "Extensions or modifications to this Agreement must be in writing."
            }
        ]
    }',
    'draft',
    1,
    true,
    NOW(),
    NOW(),
    NULL
);

-- 5. Vehicle Bill of Sale
INSERT INTO contracts (
    id,
    title,
    content_json,
    status,
    version,
    is_template,
    created_at,
    updated_at,
    org_id
) VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    'Vehicle Bill of Sale',
    '{
        "title": "Vehicle Bill of Sale",
        "legal_context": "Legal document transferring ownership of a motor vehicle from a Seller to a Buyer.",
        "blocks": [
            {
                "id": "header_1",
                "type": "header",
                "content": "Vehicle Bill of Sale"
            },
            {
                "id": "clause_1",
                "type": "clause",
                "content": "This Bill of Sale is made between the Seller and the Buyer for the transfer of the vehicle described below."
            },
            {
                "id": "header_2",
                "type": "header",
                "content": "1. Vehicle Description"
            },
            {
                "id": "clause_2",
                "type": "clause",
                "content": "The Seller transfers the following Vehicle to the Buyer: [Make, Model, Year, VIN, Odometer Reading]."
            },
            {
                "id": "header_3",
                "type": "header",
                "content": "2. Purchase Price"
            },
            {
                "id": "clause_3",
                "type": "clause",
                "content": "The Buyer agrees to pay the Seller the total purchase price of [Amount] in exchange for the Vehicle."
            },
            {
                "id": "header_4",
                "type": "header",
                "content": "3. Seller''s Representations"
            },
            {
                "id": "clause_4",
                "type": "clause",
                "content": "The Seller certifies that they are the legal owner of the Vehicle and have the authority to sell it. The Seller warrants that the Vehicle is free of all liens and encumbrances."
            },
            {
                "id": "header_5",
                "type": "header",
                "content": "4. \"As-Is\" Sale"
            },
            {
                "id": "clause_5",
                "type": "clause",
                "content": "Except as expressly provided in this Bill of Sale, the Vehicle is sold \"AS IS\" and the Seller makes no other warranties, express or implied, regarding the condition of the Vehicle."
            },
            {
                "id": "footer_1",
                "type": "footer",
                "content": "The Seller and Buyer acknowledge receipt of this Bill of Sale."
            }
        ]
    }',
    'draft',
    1,
    true,
    NOW(),
    NOW(),
    NULL
);
