'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { ContractPDF } from '@/components/pdf/contract-certificate'

interface DownloadCertificateButtonProps {
    contract: any
    signatures: any[]
    contractId: string
    className?: string
}

export default function DownloadCertificateButton({
    contract,
    signatures,
    contractId,
    className = ''
}: DownloadCertificateButtonProps) {
    // Only show download button if contract is signed
    if (contract?.status !== 'signed' || !signatures || signatures.length === 0) {
        return null
    }

    return (
        <PDFDownloadLink
            document={<ContractPDF contract={contract} signatures={signatures} contractId={contractId} />}
            fileName={`${contract?.title || 'contract'}_signed.pdf`}
            className={className || 'inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-all'}
        >
            {({ loading }) => (
                loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating PDF...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Signed PDF
                    </>
                )
            )}
        </PDFDownloadLink>
    )
}
