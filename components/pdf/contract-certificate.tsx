import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        paddingBottom: 100,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 9,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    documentInfoBlock: {
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 4,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: 110,
        fontSize: 9,
        color: '#666',
    },
    value: {
        flex: 1,
        fontSize: 9,
    },
    hash: {
        fontSize: 7,
        color: '#666',
        fontFamily: 'Courier',
    },
    signatureBlock: {
        marginBottom: 12,
        padding: 10,
    },
    signatureHeader: {
        fontSize: 8,
        color: '#666',
        marginBottom: 6,
    },
    signatureRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    signatureLabel: {
        width: 90,
        fontSize: 8,
        color: '#666',
    },
    signatureValue: {
        flex: 1,
        fontSize: 8,
        paddingBottom: 1,
    },
    contractHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    blockHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 6,
    },
    blockClause: {
        fontSize: 10,
        marginBottom: 8,
        lineHeight: 1.4,
    },
    blockList: {
        fontSize: 10,
        marginBottom: 4,
        marginLeft: 10,
    },
    blockFooter: {
        fontSize: 8,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
    },
    footerLogo: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
    },
    footerText: {
        fontSize: 8,
        color: '#666',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 8,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#999',
    },
})

interface ContractPDFProps {
    contract: any
    signatures: any[]
    contractId: string
}

export const ContractPDF = ({ contractId, contract, signatures }: any) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    // Using content_json from DB structure, handling potential different field names if any
    const blocks = contract?.content_json?.blocks || contract?.content?.blocks || contract?.blocks || [];
    const partyRoles = contract?.content_json?.party_roles || contract?.content?.party_roles || {};

    const getDisplayRole = (sig: any) => {
        const role = sig.role || 'Signer';
        // Check if we have a custom label override in the contract configuration
        if (role === 'Signer' && partyRoles.signer_label) return partyRoles.signer_label;
        if (role === 'Document Owner' && partyRoles.owner_label) return partyRoles.owner_label;
        return role;
    };

    return (
        <Document>
            {/* Contract Content Page(s) */}
            <Page style={styles.page}>
                <Text style={styles.contractHeader}>{contract?.title || 'Contract Document'}</Text>
                <Text style={{ fontSize: 9, color: '#666', textAlign: 'center', marginBottom: 20, marginTop: -15, fontFamily: 'Courier' }}>
                    PAKTIO reference number: {contractId}
                </Text>

                {blocks.map((block: any, index: number) => {
                    switch (block.type) {
                        case 'header':
                            return <Text key={index} style={styles.blockHeader}>{block.content}</Text>;
                        case 'clause':
                            return <Text key={index} style={styles.blockClause}>{block.content}</Text>;
                        case 'list':
                            return <Text key={index} style={styles.blockList}>• {block.content}</Text>;
                        case 'footer':
                            return <Text key={index} style={styles.blockFooter}>{block.content}</Text>;
                        default:
                            return <Text key={index} style={styles.blockClause}>{block.content}</Text>;
                    }
                })}

                {/* Additional Contract Sections */}
                <View wrap={false} style={{ marginTop: 20 }}>
                    {/* Parties Section Logic without Title */}
                    {signatures && signatures.length > 0 ? (
                        signatures.map((sig: any, index: number) => (
                            <View key={index} style={{ marginBottom: 20 }}>
                                {/* Role Header */}
                                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid #eee', color: '#000' }}>
                                    {getDisplayRole(sig)}
                                </Text>

                                {/* Details Grid/List */}
                                <View style={styles.row}>
                                    <Text style={styles.label}>Full Name:</Text>
                                    <Text style={styles.value}>{sig.first_name} {sig.last_name}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.label}>Date of Birth:</Text>
                                    <Text style={styles.value}>
                                        {sig.date_of_birth ? new Date(sig.date_of_birth).toLocaleDateString() : '-'}
                                    </Text>
                                </View>

                                {sig.ssn && (
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Social Security No:</Text>
                                        <Text style={styles.value}>{sig.ssn}</Text>
                                    </View>
                                )}

                                <View style={styles.row}>
                                    <Text style={styles.label}>Email Address:</Text>
                                    <Text style={styles.value}>{sig.signer_email}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.label}>Phone Number:</Text>
                                    <Text style={styles.value}>{sig.phone_number}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.label}>Address:</Text>
                                    <Text style={styles.value}>
                                        {sig.address}, {sig.postal_code} {sig.city}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#666' }}>
                            No parties recorded.
                        </Text>
                    )}
                </View>

                <View wrap={false}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                        Attachments
                    </Text>
                    <Text style={{ fontSize: 10 }}>No attachments</Text>
                </View>

                <View wrap={false}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                        Signatures
                    </Text>
                    <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
                        This contract is signed electronically using PAKTIO's e-signing service. The signatures with detailed information are attached in a separate signing certificate page at the end of this pdf.
                    </Text>
                    <Text style={{ fontSize: 10, marginTop: 10, lineHeight: 1.5 }}>
                        Learn more about PAKTIO's electronic signatures at{' '}
                        <Text style={{ color: '#2563eb' }}>https://www.paktio.com/en/signing</Text>
                    </Text>
                </View>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />

                {/* Footer Logo fixed on bottom of every page */}
                <View style={styles.footer}>
                    <Text style={styles.footerLogo}>PAKTIO</Text>
                    <Text style={styles.footerText}>
                        Digitally signed and verified • {baseUrl}
                    </Text>
                </View>
            </Page>

            {/* Certificate Page */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Digital Signing Certificate</Text>
                    <Text style={[styles.subtitle, { marginTop: 4 }]}>
                        This certificate attests to the integrity and signing of the document.
                    </Text>
                    <Text style={[styles.subtitle, { marginTop: 2, fontStyle: 'italic', fontSize: 8 }]}>
                        Verified by Paktio via SHA-256 Hashing
                    </Text>
                </View>

                {/* Document Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Document Information</Text>

                    <View style={styles.documentInfoBlock}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Document Name:</Text>
                            <Text style={styles.value}>{contract?.title}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Creation Date:</Text>
                            <Text style={styles.value}>
                                {new Date(contract?.created_at || '').toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Reference Number:</Text>
                            <Text style={[styles.value, { fontFamily: 'Courier' }]}>{contractId}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Document Hash:</Text>
                            <Text style={styles.hash}>{contract?.current_hash || 'Not yet calculated'}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Access URL:</Text>
                            <Text style={[styles.value, { fontSize: 8, color: '#666' }]}>
                                {baseUrl}/sign/{contractId}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Version:</Text>
                            <Text style={styles.value}>v{contract?.version}</Text>
                        </View>

                        <View style={[styles.row, { marginBottom: 0 }]}>
                            <Text style={styles.label}>Status:</Text>
                            <Text style={styles.value}>
                                {contract?.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Signatures */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Signatures</Text>

                    {signatures && signatures.length > 0 ? (
                        signatures.map((sig: any, index: number) => (
                            <View key={sig.id || index} style={styles.signatureBlock}>
                                {/* Full Name as Header */}
                                <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>
                                    {sig.first_name} {sig.last_name}
                                </Text>

                                <Text style={styles.signatureHeader}>
                                    Signed: {new Date(sig.signed_at).toLocaleDateString()} at{' '}
                                    {new Date(sig.signed_at).toLocaleTimeString()}
                                </Text>

                                {/* Email */}
                                <View style={styles.signatureRow}>
                                    <Text style={styles.signatureLabel}>Email:</Text>
                                    <Text style={styles.signatureValue}>{sig.signer_email}</Text>
                                </View>

                                {/* Phone */}
                                <View style={styles.signatureRow}>
                                    <Text style={styles.signatureLabel}>Phone:</Text>
                                    <Text style={styles.signatureValue}>{sig.phone_number}</Text>
                                </View>

                                {/* Date of Birth */}
                                <View style={styles.signatureRow}>
                                    <Text style={styles.signatureLabel}>Date of Birth:</Text>
                                    <Text style={styles.signatureValue}>
                                        {sig.date_of_birth ? new Date(sig.date_of_birth).toLocaleDateString() : '-'}
                                    </Text>
                                </View>

                                {/* SSN (Optional) */}
                                {sig.ssn ? (
                                    <View style={styles.signatureRow}>
                                        <Text style={styles.signatureLabel}>SSN:</Text>
                                        <Text style={styles.signatureValue}>{sig.ssn}</Text>
                                    </View>
                                ) : null}

                                {/* Address (combined) */}
                                <View style={styles.signatureRow}>
                                    <Text style={styles.signatureLabel}>Address:</Text>
                                    <Text style={styles.signatureValue}>
                                        {sig.address}, {sig.postal_code} {sig.city}
                                    </Text>
                                </View>

                                <View style={{ marginTop: 4, fontSize: 7, color: '#666' }}>
                                    <Text>Email verified | Version v{sig.version_signed}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 9, color: '#666', fontStyle: 'italic' }}>
                            No signatures recorded yet.
                        </Text>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerLogo}>PAKTIO</Text>
                    <Text style={styles.footerText}>
                        Digitally signed and verified • {baseUrl}
                    </Text>
                    <Text style={[styles.footerText, { fontSize: 7, marginTop: 3 }]}>
                        Certificate generated on {new Date().toLocaleString()}
                    </Text>
                </View>

                {/* Page Number on Certificate too */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}
