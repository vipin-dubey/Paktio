import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

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
        right: 30,
        textAlign: 'right',
        color: '#999',
    },
    signatureBox: {
        width: 140,
        height: 60,
        border: '1px dashed #ccc',
        backgroundColor: '#fbfbfb',
        padding: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signatureImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    }
})

export const ContractPDF = ({ contractId, contract, signatures }: any) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    const blocks = contract?.content_json?.blocks || contract?.content?.blocks || contract?.blocks || [];
    const partyRoles = contract?.content_json?.party_roles || contract?.content?.party_roles || {};

    const getDisplayRole = (sig: any) => {
        const role = sig.role || 'Signer';
        if (role === 'Signer' && partyRoles.signer_label) return partyRoles.signer_label;
        if (role === 'Document Owner' && partyRoles.owner_label) return partyRoles.owner_label;
        return role;
    };

    return (
        <Document>
            {/* Page 1: Contract Content */}
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

                <View wrap={false} style={{ marginTop: 20 }}>
                    {signatures && signatures.length > 0 ? (
                        signatures.map((sig: any, index: number) => (
                            <View key={index} style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6, paddingBottom: 2, borderBottom: '1px solid #eee' }}>
                                    {getDisplayRole(sig)}
                                </Text>
                                <View style={styles.row}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{sig.first_name} {sig.last_name}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>DOB:</Text><Text style={styles.value}>{sig.date_of_birth ? new Date(sig.date_of_birth).toLocaleDateString() : '-'}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{sig.signer_email}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{sig.phone_number}</Text></View>
                                <View style={styles.row}><Text style={styles.label}>Address:</Text><Text style={styles.value}>{sig.address}, {sig.postal_code} {sig.city}</Text></View>
                                {sig.ssn && <View style={styles.row}><Text style={styles.label}>SSN:</Text><Text style={styles.value}>{sig.ssn}</Text></View>}
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#666' }}>No parties recorded.</Text>
                    )}
                </View>

                <View wrap={false}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                        Attachments
                    </Text>
                    <Text style={{ fontSize: 9 }}>No attachments</Text>
                </View>

                <View wrap={false}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 4 }}>
                        Signatures
                    </Text>
                    <Text style={{ fontSize: 9, lineHeight: 1.5 }}>
                        This contract is signed electronically using PAKTIO's e-signing service. The signatures with detailed information are attached in a separate signing certificate page at the end of this pdf.
                    </Text>
                    <Text style={{ fontSize: 9, marginTop: 8, lineHeight: 1.5 }}>
                        Learn more about PAKTIO's electronic signatures at{' '}
                        <Text style={{ color: '#2563eb' }}>{baseUrl}/en/signing</Text>
                    </Text>
                </View>

                {/* Page Number & Original Footer */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
                <View style={styles.footer} fixed>
                    <Text style={styles.footerLogo}>PAKTIO</Text>
                    <Text style={styles.footerText}>Digitally signed and verified • {baseUrl}</Text>
                </View>
            </Page>

            {/* Page 2: Signing Certificate */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Digital Signing Certificate</Text>
                    <Text style={[styles.subtitle, { marginTop: 4 }]}>This certificate attests to the integrity of the document.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Document Information</Text>
                    <View style={styles.documentInfoBlock}>
                        <View style={styles.row}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{contract?.title}</Text></View>
                        <View style={styles.row}><Text style={styles.label}>Reference:</Text><Text style={[styles.value, { fontFamily: 'Courier' }]}>{contractId}</Text></View>
                        <View style={styles.row}><Text style={styles.label}>Hash:</Text><Text style={styles.hash}>{contract?.current_hash}</Text></View>
                        <View style={styles.row}><Text style={styles.label}>Version:</Text><Text style={styles.value}>v{contract?.version}</Text></View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Signing Records & Handwritten Signatures</Text>
                    {signatures?.map((sig: any, index: number) => (
                        <View key={sig.id || index} style={[styles.signatureBlock, { border: '1px solid #f0f0f0', borderRadius: 4, marginBottom: 15 }]} wrap={false}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>{sig.first_name} {sig.last_name}</Text>
                                    <Text style={styles.signatureHeader}>Signed: {new Date(sig.signed_at).toLocaleString()}</Text>
                                    <View style={styles.signatureRow}><Text style={styles.signatureLabel}>Email:</Text><Text style={styles.signatureValue}>{sig.signer_email}</Text></View>
                                    <View style={styles.signatureRow}><Text style={styles.signatureLabel}>Phone:</Text><Text style={styles.signatureValue}>{sig.phone_number}</Text></View>
                                    <View style={styles.signatureRow}><Text style={styles.signatureLabel}>Address:</Text><Text style={styles.signatureValue}>{sig.address}, {sig.city}</Text></View>
                                </View>
                                <View style={{ alignItems: 'center', marginLeft: 10 }}>
                                    <Text style={{ fontSize: 7, color: '#999', marginBottom: 4 }}>CAPTURED SIGNATURE</Text>
                                    <View style={styles.signatureBox}>
                                        {sig.signature_image ? (
                                            <Image src={sig.signature_image} style={styles.signatureImage} />
                                        ) : (
                                            <Text style={{ fontSize: 8, color: '#ccc' }}>No image</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Page Number & Original Footer */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
                <View style={styles.footer} fixed>
                    <Text style={styles.footerLogo}>PAKTIO</Text>
                    <Text style={styles.footerText}>Digitally signed and verified • {baseUrl}</Text>
                </View>
            </Page>
        </Document >
    )
}
