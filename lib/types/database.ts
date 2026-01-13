export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Enums: {
            locale_type: 'en' | 'no' | 'se' | 'dk'
        }
    }
}

export interface ContractBlock {
    id: string
    type: 'header' | 'clause' | 'list' | 'footer'
    content: string
}

export interface ContractContent {
    title: string
    blocks: ContractBlock[]
    legal_context: string
    party_roles?: {
        owner_label?: string
        signer_label?: string
    }
}

export interface Contract {
    id: string
    org_id: string | null
    created_by: string | null
    title: string
    content_json: ContractContent
    current_hash: string | null
    status: 'draft' | 'pending' | 'signed'
    version: number
    is_template: boolean /* Added this field */
    created_at: string
}

export interface Signature {
    id: string
    contract_id: string
    signer_email: string
    signed_at: string
    ip_address: string | null
    version_signed: number
    first_name: string | null
    last_name: string | null
    phone_number: string | null
    ssn: string | null
    address: string | null
    postal_code: string | null
    city: string | null
    date_of_birth: string | null
    email_verified?: boolean
    signature_image?: string | null
}

// DTOs
export interface ContractDTO {
    id: string
    title: string
    status: Contract['status']
    version: number
    is_template: boolean
    updated_at: string
    created_at: string
    current_hash?: string | null
}

export interface ContractDetailDTO extends ContractDTO {
    content: ContractContent
    signatures: Signature[]
}
