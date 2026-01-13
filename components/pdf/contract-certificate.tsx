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
})

interface ContractPDFProps {
    contract: any
    signatures: any[]
    contractId: string
}

export const ContractPDF = ({ contract, signatures, contractId }: ContractPDFProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                        Digital Contract Certificate
                    </Text>
                    <Text style={{ fontSize: 8, color: '#666', textAlign: 'center', lineHeight: 1.4 }}>
                        This certificate verifies the authenticity and legal validity of the digital signatures
                        recorded below. The original contract document is securely stored by Paktio, and the
                        SHA-256 hash provided can be used to verify that the document remains unaltered since signing.
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
                        signatures.map((sig, index) => (
                            <View key={sig.id} style={styles.signatureBlock}>
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
            </Page>
        </Document>
    )
}
