import {Document, Font, Page, PDFDownloadLink, StyleSheet, Text} from '@react-pdf/renderer'
import Button from "@/components/Button/Button";

interface Props {
    columns: string[]
    data: Record<any, any>[]
    filename: string
}

Font.register({
    family: 'IranSans',
    src: "/fonts/IRANSansWeb.ttf",
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'IranSans',
    }
})

const DataTableReportPDF = (props: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {props.columns?.map(col => <Text key={col}>{col}</Text>)}
        </Page>
    </Document>
)

const DataTableReportPDFDownload = (props: Props) => (
    <div>
        <PDFDownloadLink document={<DataTableReportPDF {...props}/>} fileName={`${props.filename}.pdf`}>
            {({blob, url, loading, error}) => (
                <div className="mb-20">
                    <Button disable={loading}
                            title={loading ? "در حال آماده سازی" : "دانلود فاکتور"}
                            color="primary"
                            outline={true}/>
                </div>
            )}
        </PDFDownloadLink>
    </div>
)

export default DataTableReportPDFDownload