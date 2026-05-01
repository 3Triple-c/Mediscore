import { forwardRef, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './css/App.css'

const chemistryPage1 = [
  ['patientName', 'Patient name', 'text', 'Patient details', 1, 25.0, 29.4, 73.0, 2.7],
  ['sex', 'Sex', 'text', 'Patient details', 1, 15.5, 32.7, 14.0, 2.7],
  ['age', 'Age', 'number', 'Patient details', 1, 31.5, 32.7, 17.0, 2.7],
  ['labNo', 'Lab number', 'text', 'Patient details', 1, 54.5, 32.7, 16.5, 2.7],
  ['date', 'Date', 'date', 'Patient details', 1, 73.8, 32.7, 22.5, 2.7],
  ['amylase', 'Amylase serum', 'text', 'Chemistry page 1', 1, 24.5, 36.1, 46.0, 2.6],
  ['creatinine', 'Creatinine serum', 'text', 'Chemistry page 1', 1, 26.0, 39.2, 46.0, 2.6],
  ['bloodUrea', 'Blood urea serum', 'text', 'Chemistry page 1', 1, 26.7, 42.3, 45.8, 2.6],
  ['uricAcid', 'Uric acid serum', 'text', 'Chemistry page 1', 1, 25.2, 45.5, 47.0, 2.6],
  ['calcium', 'Calcium serum', 'text', 'Chemistry page 1', 1, 25.2, 48.4, 47.0, 2.6],
  ['phosphorus', 'Inorganic phosphate', 'text', 'Chemistry page 1', 1, 37.0, 51.8, 35.0, 2.6],
  ['cholesterol', 'Cholesterol serum', 'text', 'Chemistry page 1', 1, 26.8, 55.4, 45.0, 2.6],
  ['acidPhosphatase', 'Acid phosphatase', 'text', 'Chemistry page 1', 1, 27.0, 58.5, 47.0, 2.6],
  ['fastingBloodSugar', 'Fasting blood sugar', 'text', 'Chemistry page 1', 1, 26.0, 61.7, 47.0, 2.6],
  ['randomBloodSugar', 'Random blood sugar', 'text', 'Chemistry page 1', 1, 28.3, 64.9, 45.0, 2.6],
  ['postPrandial', '2 hours post prandial sugar', 'text', 'Chemistry page 1', 1, 31.8, 68.1, 43.0, 2.6],
  ['triglycerides', 'Triglycerides', 'text', 'Chemistry page 1', 1, 21.7, 71.2, 52.0, 2.6],
  ['benceJones', 'Bence Jones protein', 'text', 'Chemistry page 1', 1, 27.0, 74.3, 48.0, 2.6],
]

const chemistryPage2 = [
  ['totalProtein', 'Total protein', 'text', 'CSR / serum protein', 2, 22.2, 16.1, 52.0, 2.6],
  ['globulin', 'Globulin', 'text', 'CSR / serum protein', 2, 18.9, 19.2, 55.6, 2.6],
  ['albumin', 'Albumin', 'text', 'CSR / serum protein', 2, 19.1, 22.5, 55.0, 2.6],
  ['csfProtein', 'C.S.F. protein', 'text', 'CSR / serum protein', 2, 23.1, 25.9, 51.5, 2.6],
  ['totalBilirubin', 'Total bilirubin', 'text', 'Liver function test', 2, 23.4, 32.0, 47.0, 2.6],
  ['directBilirubin', 'Direct bilirubin', 'text', 'Liver function test', 2, 23.1, 35.1, 47.2, 2.6],
  ['alkalinePhosphatase', 'Alkaline phosphatase', 'text', 'Liver function test', 2, 28.2, 38.5, 42.0, 2.6],
  ['sgot', 'SGOT', 'text', 'Liver function test', 2, 16.5, 41.6, 54.5, 2.6],
  ['sgpt', 'SGPT', 'text', 'Liver function test', 2, 16.5, 44.8, 54.5, 2.6],
  ['sodium', 'Sodium', 'text', 'Electrolytes', 2, 19.0, 51.4, 52.0, 2.6],
  ['potassium', 'Potassium', 'text', 'Electrolytes', 2, 20.4, 54.6, 51.5, 2.6],
  ['bicarbonate', 'Bicarbonate', 'text', 'Electrolytes', 2, 21.4, 57.7, 50.5, 2.6],
  ['chloride', 'Chloride', 'text', 'Electrolytes', 2, 18.9, 60.9, 53.0, 2.6],
  ['scientist', 'Medical lab scientist', 'text', 'Authorization', 2, 65.2, 73.0, 20.0, 2.8],
]

const demicroFields = [
  ['patientName', 'Patient name', 'text', 'Patient details', 1, 25.0, 22.7, 73.0, 2.1],
  ['sex', 'Sex', 'text', 'Patient details', 1, 15.3, 24.0, 8.0, 2.0],
  ['age', 'Age', 'number', 'Patient details', 1, 29.0, 24.0, 8.0, 2.0],
  ['labNo', 'Lab number', 'text', 'Patient details', 1, 40.8, 24.0, 10.0, 2.0],
  ['date', 'Date', 'date', 'Patient details', 1, 57.8, 24.0, 12.0, 2.0],
  ...lineFields('Urinalysis', 1, 20.8, 29.0, 33.6, 2.7, ['appearance', 'reactionPh', 'protein', 'sugar', 'ketones', 'urobilinogen', 'bilirubin', 'blood', 'nitrite', 'ascorbicAcid']),
  ...lineFields('Faeces', 1, 21.2, 51.7, 34.2, 2.65, ['faecesAppearance', 'protozoa', 'cyst', 'wbcFaeces', 'rbcFaeces', 'occultBlood', 'faecesOthers']),
  ['culture', 'Culture', 'textarea', 'Faeces', 1, 21.0, 81.0, 32.0, 6.0],
  ...lineFields('Microbiology', 1, 60.7, 29.0, 39.0, 2.7, ['wbcMicro', 'rbcMicro', 'epithelialCells', 'casts', 'crystals', 'yeastCell', 'bacterialCells', 'parasites', 'microOthers']),
  ['salmonellaTyphiH', 'S. typhi H', 'text', 'Serology', 1, 78.0, 51.0, 7.0, 2.0],
  ['salmonellaTyphiO', 'S. typhi O', 'text', 'Serology', 1, 90.0, 51.0, 7.0, 2.0],
  ['salmonellaA', 'S. paratyphi A', 'text', 'Serology', 1, 80.0, 53.9, 16.0, 2.0],
  ['salmonellaB', 'S. paratyphi B', 'text', 'Serology', 1, 80.0, 55.6, 16.0, 2.0],
  ['salmonellaC', 'S. paratyphi C', 'text', 'Serology', 1, 80.0, 57.2, 16.0, 2.0],
  ...lineFields('Serology', 1, 71.0, 58.5, 28.0, 2.65, ['vdrl', 'pregnancyTest', 'malariaParasite', 'rheumatoidFactor']),
  ...lineFields('Sputum AFB', 1, 63.7, 66.9, 36.0, 2.65, ['afbx1', 'afbx2', 'afbx3']),
  ...lineFields('HVS wet prep', 1, 62.2, 73.0, 37.0, 2.65, ['hvsWbc', 'hvsRbc', 'hvsYeast', 'trichomonas', 'hvsEpithelial', 'bacteriaDebri']),
  ['scientist', 'Medical lab scientist', 'text', 'Authorization', 1, 67.0, 92.4, 25.0, 2.4],
]

const drugFields = [
  ...lineFields('Drug sensitivity', 1, 34.0, 18.8, 20.5, 3.15, [
    'amoxil',
    'ampicilin',
    'ampiclox',
    'augmentin',
    'chloromphenicol',
    'cefixime',
    'ciprofloxacin',
    'gentamicin',
    'erythromicin',
    'levofloxacin',
    'nalidixicAcid',
    'norfloxacin',
    'pefloxacin',
    'rifampicin',
    'streptomycin',
    'tarivid',
    'cefatum',
    'zithromax',
    'ibefloxacin',
  ]),
  ...lineFields('Seminalysis', 1, 75.0, 22.0, 20.0, 4.65, [
    'timeProduction',
    'timeReceived',
    'timeExamination',
    'abstinance',
    'appearance',
    'volume',
    'viscosity',
    'liquification',
  ]),
  ['motility', 'Motility', 'text', 'Seminalysis', 1, 72.0, 49.0, 21.0, 2.5],
  ['active', '% active', 'text', 'Seminalysis', 1, 72.0, 51.9, 21.0, 2.5],
  ['sluggish', '% sluggish', 'text', 'Seminalysis', 1, 72.0, 55.1, 21.0, 2.5],
  ['nonActive', '% non-active', 'text', 'Seminalysis', 1, 72.0, 58.1, 21.0, 2.5],
  ['abnormality', '% abnormality', 'text', 'Morphology', 1, 77.0, 64.4, 17.0, 2.5],
  ['wbc', 'WBC', 'text', 'Morphology', 1, 66.0, 67.4, 27.0, 2.5],
  ['rbc', 'RBC', 'text', 'Morphology', 1, 66.0, 70.5, 27.0, 2.5],
  ['totalCount', 'Total count', 'text', 'Morphology', 1, 74.0, 73.2, 20.0, 2.5],
  ['otherTests', 'Other tests', 'textarea', 'Other tests', 1, 62.5, 82.4, 36.0, 5.4],
  ['scientist', 'Medical lab scientist', 'text', 'Authorization', 1, 62.5, 85.8, 32.0, 2.7],
]

const hematologyFields = [
  ['patientName', 'Patient name', 'text', 'Patient details', 1, 25.5, 22.6, 42.0, 2.2],
  ['sex', 'Sex', 'text', 'Patient details', 1, 15.5, 25.1, 11.0, 2.1],
  ['age', 'Age', 'number', 'Patient details', 1, 30.5, 25.1, 10.0, 2.1],
  ['labNo', 'Lab number', 'text', 'Patient details', 1, 46.6, 25.1, 12.0, 2.1],
  ['date', 'Date', 'date', 'Patient details', 1, 62.0, 25.1, 16.0, 2.1],
  ['wbc', 'WBC', 'text', 'Blood count', 1, 16.3, 26.6, 28.0, 2.2],
  ['rbc', 'RBC', 'text', 'Blood count', 1, 14.8, 30.5, 34.0, 2.2],
  ['hgb', 'HGB', 'text', 'Blood count', 1, 14.5, 32.5, 28.0, 2.2],
  ['pcv', 'PCV', 'text', 'Blood count', 1, 14.4, 34.5, 35.0, 2.2],
  ['mchc', 'MCHC', 'text', 'Blood count', 1, 15.9, 36.4, 34.0, 2.2],
  ['platelets', 'Platelets', 'text', 'Blood count', 1, 18.5, 38.4, 31.0, 2.2],
  ['retics', 'Retics', 'text', 'Blood count', 1, 16.2, 40.3, 33.0, 2.2],
  ['esr', 'ESR', 'text', 'Blood count', 1, 14.9, 42.1, 21.0, 2.2],
  ['bleedingTime', 'Bleeding time', 'text', 'Blood count', 1, 22.3, 44.0, 32.0, 2.2],
  ['clothingTime', 'Clothing time', 'text', 'Blood count', 1, 22.3, 45.9, 32.0, 2.2],
  ['hbGenotype', 'HB genotype', 'text', 'Blood count', 1, 22.3, 47.9, 31.5, 2.2],
  ['sicklingTest', 'Sickling test', 'text', 'Blood count', 1, 20.8, 49.8, 33.5, 2.2],
  ['malariaParasite', 'Malaria parasite', 'text', 'Blood count', 1, 24.2, 51.8, 30.0, 2.2],
  ['microfilaria', 'Microfilaria', 'text', 'Blood count', 1, 20.9, 53.8, 33.5, 2.2],
  ['bloodGroup', 'Blood group', 'text', 'Blood count', 1, 20.9, 55.7, 33.5, 2.2],
  ['eosinophil', 'Eosinophil', 'text', 'Blood count', 1, 20.4, 57.6, 34.0, 2.2],
  ['hiv', 'Hiv1&11', 'text', 'Blood count', 1, 18.5, 59.5, 36.0, 2.2],
  ['hbsag', 'HBSAg', 'text', 'Blood count', 1, 17.3, 61.5, 37.0, 2.2],
  ['hcv', 'HCV', 'text', 'Blood count', 1, 15.6, 63.4, 39.0, 2.2],
  ['rvdScreening', 'RVD screening', 'text', 'Blood count', 1, 23.2, 65.4, 31.0, 2.2],
  ['neutrophils', 'Neutrophils', 'text', 'Differential count', 1, 66.2, 28.6, 19.0, 2.2],
  ['lymphocytes', 'Lymphocytes', 'text', 'Differential count', 1, 66.3, 30.5, 19.0, 2.2],
  ['monocytes', 'Monocytes', 'text', 'Differential count', 1, 65.0, 32.5, 22.0, 2.2],
  ['eosinophils', 'Eosinophils', 'text', 'Differential count', 1, 66.7, 34.5, 20.0, 2.2],
  ['basophils', 'Basophils', 'text', 'Differential count', 1, 63.5, 36.4, 22.0, 2.2],
  ['blasts', 'Blasts', 'text', 'Differential count', 1, 62.3, 38.4, 24.0, 2.2],
  ['promocytes', 'Promocytes', 'text', 'Differential count', 1, 65.0, 40.3, 22.0, 2.2],
  ['myelocytes', 'Myelocytes', 'text', 'Differential count', 1, 65.0, 42.3, 22.0, 2.2],
  ['metamyelocytes', 'Metamyelocytes', 'text', 'Differential count', 1, 69.6, 44.2, 17.0, 2.2],
  ['prothrombinTest', 'Prothrombin test', 'text', 'Prothrombin time', 1, 66.0, 51.6, 20.0, 2.2],
  ['prothrombinControl', 'Prothrombin control', 'text', 'Prothrombin time', 1, 66.0, 55.2, 20.0, 2.2],
  ['prothrombinRatio', 'Prothrombin ratio', 'text', 'Prothrombin time', 1, 66.0, 58.5, 20.0, 2.2],
  ['filmReport', 'Cross matching / film report', 'textarea', 'Film report', 1, 9.0, 70.0, 78.0, 5.0],
  ['scientist', 'Medical lab scientist', 'text', 'Authorization', 1, 69.5, 73.9, 26.0, 2.4],
]

function moveFieldsToPage(fields, pageNumber, prefix = '') {
  return fields.map((field) => {
    const nextField = [...field]
    if (prefix) {
      nextField[0] = `${prefix}${nextField[0][0].toUpperCase()}${nextField[0].slice(1)}`
    }
    nextField[4] = pageNumber
    return nextField
  })
}

const templates = {
  chemistry: makeTemplate({
    id: 'chemistry',
    name: 'Chemistry Form',
    folder: 'CHEMISTRY_FORM',
    accent: '#176b6b',
    pages: ['/templates/chemistry-page-1.png', '/templates/chemistry-page-2.png'],
    fields: [...chemistryPage1, ...chemistryPage2],
    initialValues: {
      patientName: '',
      sex: '',
      age: '',
      labNo: '',
      date: '2026-05-01',
      creatinine: '',
      bloodUrea: '',
      cholesterol: '',
      fastingBloodSugar: '',
      triglycerides: '',
      sodium: '',
      potassium: '',
      chloride: '',
      scientist: 'N. Patricia',
    },
  }),
  demicrobiology: makeTemplate({
    id: 'demicrobiology',
    name: 'DE Microbiology Form',
    folder: 'DEMicrobiology_form',
    accent: '#6b3d12',
    pages: ['/templates/demicrobiology-page-1.png', '/templates/microbiology-drug-page-1.png'],
    fields: [...demicroFields, ...moveFieldsToPage(drugFields, 2, 'drug')],
    initialValues: {
      patientName: '',
      sex: '',
      age: '',
      labNo: '',
      date: '2026-05-01',
      appearance: '',
      reactionPh: '',
      protein: '',
      sugar: '',
      wbcMicro: '',
      rbcMicro: '',
      pregnancyTest: '',
      malariaParasite: '',
      drugAmoxil: '',
      drugAugmentin: '',
      drugCiprofloxacin: '',
      drugGentamicin: '',
      drugAppearance: '',
      drugVolume: '',
      scientist: 'N. Patricia',
      drugScientist: 'N. Patricia',
    },
  }),
  hematology: makeTemplate({
    id: 'hematology',
    name: 'Heamatology Form',
    folder: 'Heamatology_form',
    accent: '#7f2c3a',
    pages: ['/templates/hematology-page-1.png'],
    fields: hematologyFields,
    initialValues: {
      patientName: '',
      sex: '',
      age: '',
      labNo: '',
      date: '2026-05-01',
      wbc: '',
      rbc: '',
      hgb: '',
      pcv: '',
      mchc: '',
      platelets: '',
      retics: '',
      esr: '',
      hbGenotype: '',
      malariaParasite: '',
      bloodGroup: '',
      neutrophils: '',
      lymphocytes: '',
      monocytes: '',
      eosinophils: '',
      basophils: '',
      prothrombinTest: '',
      prothrombinControl: '',
      prothrombinRatio: '',
      filmReport: 'Normocytic red cells. White cells adequate. Platelets appear normal.Normocytic red cells.',
      scientist: 'N. Patricia',
    },
  }),
}

function lineFields(group, page, left, top, width, step, names) {
  return names.map((name, index) => [
    name,
    toLabel(name),
    'text',
    group,
    page,
    left,
    top + index * step,
    width,
    2.4,
  ])
}

function makeTemplate(template) {
  return {
    ...template,
    fields: template.fields.map(([name, label, type, group, page, left, top, width, height]) => ({
      name,
      label,
      type,
      group,
      page,
      left,
      top,
      width,
      height,
    })),
  }
}

function App() {
  const documentRef = useRef(null)
  const [templateId, setTemplateId] = useState('chemistry')
  const [documents, setDocuments] = useState(() =>
    Object.fromEntries(Object.values(templates).map((template) => [template.id, template.initialValues])),
  )
  const [saveMessage, setSaveMessage] = useState('')

  const activeTemplate = templates[templateId]
  const values = documents[templateId]
  const groupedFields = useMemo(() => groupFields(activeTemplate.fields), [activeTemplate])

  function updateField(name, value) {
    setDocuments((current) => ({
      ...current,
      [templateId]: {
        ...current[templateId],
        [name]: value,
      },
    }))
  }

  async function downloadPdf() {
    setSaveMessage('Preparing PDF...')
    try {
      const blob = await createPdf(documentRef.current)
      const filename = `${safeName(values.patientName || values.name || 'Unnamed Patient')}.pdf`
      const result = await savePdfBlob(blob, activeTemplate.folder, filename)
      setSaveMessage(result)
    } catch (error) {
      setSaveMessage(`Could not save PDF: ${error.message}`)
    }
  }

  return (
    <main className="app-shell" style={{ '--template-accent': activeTemplate.accent }}>
      <aside className="workspace-panel controls-panel">
        <div>
          <p className="eyebrow">Tender Heart digital forms</p>
          <h1>Offline result generator</h1>
        </div>

        <label className="field-block">
          <span>Template</span>
          <select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
            {Object.values(templates).map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>

        <div className="action-row">
          <button type="button" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" onClick={downloadPdf}>
            Download PDF
          </button>
          <button
            type="button"
            className="secondary-action"
            onClick={() => setDocuments((current) => ({ ...current, [templateId]: activeTemplate.initialValues }))}
          >
            Reset sample
          </button>
        </div>

        {saveMessage && <p className="save-message">{saveMessage}</p>}

        <FormEditor groups={groupedFields} values={values} onChange={updateField} />
      </aside>

      <section className="preview-area" aria-label="Document preview">
        <DocumentPreview ref={documentRef} template={activeTemplate} values={values} />
      </section>
    </main>
  )
}

function groupFields(fields) {
  return fields.reduce((groups, field) => {
    const group = field.group || 'Details'
    return {
      ...groups,
      [group]: [...(groups[group] || []), field],
    }
  }, {})
}

function FormEditor({ groups, values, onChange }) {
  return (
    <div className="form-editor">
      {Object.entries(groups).map(([group, fields]) => (
        <section className="field-group" key={group}>
          <h2>{group}</h2>
          <div className="field-grid">
            {fields.map((field) => (
              <label className={field.type === 'textarea' ? 'field-block wide-field' : 'field-block'} key={field.name}>
                <span>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea value={values[field.name] || ''} rows="3" onChange={(event) => onChange(field.name, event.target.value)} />
                ) : (
                  <input type={field.type} value={values[field.name] || ''} onChange={(event) => onChange(field.name, event.target.value)} />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const DocumentPreview = forwardRef(function DocumentPreview({ template, values }, ref) {
  return (
    <article className="document-stack printable-document" ref={ref}>
      {template.id === 'chemistry' && <ChemistryDocument values={values} />}
      {template.id === 'demicrobiology' && <MicrobiologyDocument values={values} />}
      {template.id === 'hematology' && <HematologyDocument values={values} />}
    </article>
  )
})

function ChemistryDocument({ values }) {
  return (
    <>
      <PaperPage>
        <LabHeader title="CLINICAL CHEMISTRY REPORT FORM" />
        <PatientStrip values={values} />
        <LineList
          rows={[
            ['Amylase (serum)', 'amylase', 'mg/dl'],
            ['Creatinine(serum)', 'creatinine', 'mg/dl'],
            ['Blood Urea (serum)', 'bloodUrea', 'mg/dl'],
            ['Uric acid (serum)', 'uricAcid', 'mg/dl'],
            ['Calcium (serum)', 'calcium', 'mg/dl'],
            ['Inorganic Phosphate (Phosphorus)', 'phosphorus', 'mg/dl'],
            ['Cholesterol (serum)', 'cholesterol', 'mg/dl(200-239mg/dl)'],
            ['Acid Phosphatase(T)', 'acidPhosphatase', 'mg/dl'],
            ['Fasting Blood sugar', 'fastingBloodSugar', 'mg/dl'],
            ['Random Blood Sugar', 'randomBloodSugar', 'mg/dl'],
            ['2 Hours Post Prandal Sugar', 'postPrandial', 'mg/dl'],
            ['Triglycerides', 'triglycerides', 'mg/dl'],
            ['Bence Jones Protein', 'benceJones', 'mg/dl'],
          ]}
          values={values}
        />
      </PaperPage>
      <PaperPage>
        <section className="paper-body offset-body">
          <h3>CSR/SERUM PROTEIN</h3>
          <LineList
            rows={[
              ['Total Protein', 'totalProtein', 'mg/dl'],
              ['Globulin', 'globulin', 'mg/dl'],
              ['Albumin', 'albumin', 'mg/dl'],
              ['C. S. F. Protein', 'csfProtein', 'mg/dl'],
            ]}
            values={values}
            compact
          />
          <h3>LIVER FUNCTION TEST (LFT)</h3>
          <LineList
            rows={[
              ['Total Bilirubin', 'totalBilirubin', 'mg/dl(Up to 1mg/dl)'],
              ['Direct Bilirubin', 'directBilirubin', 'mg/dl(Up to 0.25mg/di)'],
              ['Alkaline Phosphatase', 'alkalinePhosphatase', 'mg/dl'],
              ['SGOT', 'sgot', 'U/L(up to 12U/L)'],
              ['SGPT', 'sgpt', 'U/L(up to 12U/L)'],
            ]}
            values={values}
            compact
          />
          <h3>ELETROLYTES</h3>
          <LineList
            rows={[
              ['Sodium', 'sodium', 'mg/dl'],
              ['Potassium', 'potassium', 'mg/di'],
              ['Bicarbonate', 'bicarbonate', 'mg/dl'],
              ['Chloride', 'chloride', 'mg/dl'],
            ]}
            values={values}
            compact
          />
        </section>
        <Signature value={values.scientist} />
      </PaperPage>
    </>
  )
}

function MicrobiologyDocument({ values }) {
  return (
    <>
      <PaperPage className="dense-page">
        <LabHeader title="Motto: We diagnose, God heals, (Microbiology/Parasitology)" compact />
        <PatientStrip values={values} compact />
        <div className="micro-grid">
          <section>
            <h3>URINALYSIS (AMACROBIOLOGY)</h3>
            <LineList
              rows={[
                ['Appearance', 'appearance'],
                ['Reaction (PH)', 'reactionPh'],
                ['Protein', 'protein'],
                ['Sugar', 'sugar'],
                ['Ketones', 'ketones'],
                ['Urobilinogen', 'urobilinogen'],
                ['Bilirubin', 'bilirubin'],
                ['Blood', 'blood'],
                ['Nitrite', 'nitrite'],
                ['Ascorbic Acid', 'ascorbicAcid'],
              ]}
              values={values}
              tight
            />
            <h3 className="center-title">FEACES</h3>
            <LineList
              rows={[
                ['Appearance', 'faecesAppearance'],
                ['Protozoa', 'protozoa'],
                ['Cyst', 'cyst'],
                ['WBC', 'wbcFaeces'],
                ['RBC', 'rbcFaeces'],
                ['Occult Blood Test', 'occultBlood'],
                ['Others', 'faecesOthers'],
              ]}
              values={values}
              tight
            />
            <div className="culture-box">
              <strong>CULTURE:</strong>
              <ValueBlock value={values.culture} />
            </div>
          </section>
          <section>
            <h3>(B)MICROBIOLOGY</h3>
            <LineList
              rows={[
                ['WBC', 'wbcMicro'],
                ['RBC', 'rbcMicro'],
                ['Epithelial Cells', 'epithelialCells'],
                ['Casts', 'casts'],
                ['Crystals', 'crystals'],
                ['Yeast Cell', 'yeastCell'],
                ['Bacterial Cells', 'bacterialCells'],
                ['Parasites', 'parasites'],
                ['Others', 'microOthers'],
              ]}
              values={values}
              tight
            />
            <h3 className="center-title">SEROLOGY</h3>
            <div className="widal-grid">
              <span>WIDAL TEST:</span>
              <span>H</span>
              <span>O</span>
              <span>Salmonella Typhi:</span>
              <ValueLine value={values.salmonellaTyphiH} />
              <ValueLine value={values.salmonellaTyphiO} />
              <span>Salmonella paratyphi A:</span>
              <ValueLine value={values.salmonellaA} wide />
              <span>Salmonella paratyphi B:</span>
              <ValueLine value={values.salmonellaB} wide />
              <span>Salmonella paratyphi C:</span>
              <ValueLine value={values.salmonellaC} wide />
            </div>
            <LineList
              rows={[
                ['VDRL', 'vdrl'],
                ['Pregnancy Test', 'pregnancyTest'],
                ['Malaria parasite', 'malariaParasite'],
                ['Rheumatoid Factor', 'rheumatoidFactor'],
              ]}
              values={values}
              tight
            />
            <h3>SPUTUM AFB</h3>
            <LineList rows={[['AFBX1', 'afbx1'], ['AFBX2', 'afbx2'], ['AFBX3', 'afbx3']]} values={values} tight />
            <h3>H V S (Wet prep.)</h3>
            <LineList
              rows={[
                ['WBC', 'hvsWbc'],
                ['RBC', 'hvsRbc'],
                ['Yeast Cells', 'hvsYeast'],
                ['T.Vaginalis', 'trichomonas'],
                ['Epithelial Cells', 'hvsEpithelial'],
                ['Bacteria debri', 'bacteriaDebri'],
              ]}
              values={values}
              tight
            />
          </section>
        </div>
        <Signature value={values.scientist} />
      </PaperPage>
      <DrugSensitivityPage values={values} prefix="drug" />
    </>
  )
}

function DrugSensitivityPage({ values, prefix = '' }) {
  const key = (name) => (prefix ? `${prefix}${name[0].toUpperCase()}${name.slice(1)}` : name)
  return (
    <PaperPage className="drug-page">
      <div className="drug-layout">
        <table className="drug-table">
          <tbody>
            {[
              'amoxil',
              'ampicilin',
              'ampiclox',
              'augmentin',
              'chloromphenicol',
              'cefixime',
              'ciprofloxacin',
              'gentamicin',
              'erythromicin',
              'levofloxacin',
              'nalidixicAcid',
              'norfloxacin',
              'pefloxacin',
              'rifampicin',
              'streptomycin',
              'tarivid',
              'cefatum',
              'zithromax',
              'ibefloxacin',
            ].map((name) => (
              <tr key={name}>
                <td>{toLabel(name)}</td>
                <td>{values[key(name)]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="seminalysis">
          <h3>SEMINALYSIS</h3>
          <LineList
            rows={[
              ['Time of Production', key('timeProduction')],
              ['Time Received', key('timeReceived')],
              ['Time of Examination', key('timeExamination')],
              ['Duration of Abstinance', key('abstinance')],
              ['Appearance', key('appearance')],
              ['Volume', key('volume')],
              ['Viscosity', key('viscosity')],
              ['Liquification', key('liquification')],
              ['Motility', key('motility')],
              ['% Active', key('active')],
              ['% Sluggish', key('sluggish')],
              ['% Non- Active', key('nonActive')],
              ['% Abnormality', key('abnormality')],
              ['Wbc', key('wbc')],
              ['Rbc', key('rbc')],
              ['TOTAL COUNT', key('totalCount')],
            ]}
            values={values}
            noLineForBlankLabels
          />
          <h3>OTHER TESTS:</h3>
          <ValueBlock value={values[key('otherTests')]} />
          <Signature value={values[key('scientist')]} />
        </section>
      </div>
      <div className="legend">
        <strong>S - Sensitive</strong>
        <strong>R - Resistance</strong>
      </div>
    </PaperPage>
  )
}

function HematologyDocument({ values }) {
  return (
    <PaperPage className="hematology-page">
      <LabHeader title="HEAMATOLOGY REPORT FORM" />
      <PatientStrip values={values} compact />
      <div className="hematology-grid">
        <section>
          <LineList
            rows={[
              ['WBC', 'wbc', '/ mm3'],
              ['RBC', 'rbc', '/mm3'],
              ['HGB', 'hgb', 'g/100ml (%)'],
              ['PCV', 'pcv', '%'],
              ['MCHC', 'mchc', '%'],
              ['Platelets', 'platelets', 'mm3'],
              ['Retics', 'retics', '%'],
              ['ESR', 'esr', 'mm/hr(wester green)'],
              ['Bleeding Time', 'bleedingTime'],
              ['Clothing Time', 'clothingTime'],
              ['HB Genotype', 'hbGenotype'],
              ['Sickling Test', 'sicklingTest'],
              ['Malaria parasite', 'malariaParasite'],
              ['Microfilaria', 'microfilaria'],
              ['Blood group', 'bloodGroup'],
              ['Eosinophil', 'eosinophil'],
              ['Hiv1&11', 'hiv'],
              ['HBSAg', 'hbsag'],
              ['HCV', 'hcv'],
              ['RVD Screening', 'rvdScreening'],
            ]}
            values={values}
            tight
          />
        </section>
        <section>
          <h3 className="center-title">DIFFERENTIAL COUNT</h3>
          <LineList
            rows={[
              ['Neutrophils', 'neutrophils', '%'],
              ['Lymphocytes', 'lymphocytes', '%'],
              ['Monocytes', 'monocytes', '%'],
              ['Eosinophils', 'eosinophils', '%'],
              ['Basophils', 'basophils', '%'],
              ['Blasts', 'blasts', '%'],
              ['Promocytes', 'promocytes', '%'],
              ['Myelocytes', 'myelocytes', '%'],
              ['Metamyelocytes', 'metamyelocytes', '%'],
            ]}
            values={values}
            tight
          />
          <div className="prothrombin">
            <h3>PROTHROMBIN TIME</h3>
            <LineList
              rows={[
                ['TEST', 'prothrombinTest'],
                ['CONTROL', 'prothrombinControl'],
                ['RATIO', 'prothrombinRatio'],
              ]}
              values={values}
              noLineForBlankLabels
            />
          </div>
        </section>
      </div>
      <section className="film-report">
        <h3>Cross Matching/Film Report</h3>
        <ValueBlock value={values.filmReport} />
      </section>
      <Signature value={values.scientist} />
    </PaperPage>
  )
}

function PaperPage({ children, className = '' }) {
  return <section className={`page paper-form ${className}`}>{children}</section>
}

function LabHeader({ title, compact = false }) {
  return (
    <header className={compact ? 'lab-header compact-lab-header' : 'lab-header'}>
      <p>0DE:2 6980</p>
      <h2>TENDER HEART LABORATORIES AND DIAGNOSTIC CENTRE</h2>
      <p>No 2 Ben Ajuonuma Street Off Oraifite Road, Awada Obosi, Anambra State.</p>
      <p>
        E-mail <u>patiechuks@gmail.com</u> ,Phone: 08036184329,08110330886.
      </p>
      {!compact && <p>Motto: We diagnose, God heals</p>}
      <strong>{title}</strong>
    </header>
  )
}

function PatientStrip({ values, compact = false }) {
  return (
    <section className={compact ? 'patient-strip compact-patient-strip' : 'patient-strip'}>
      <div className="patient-name">
        <strong>PATIENT'S NAME :</strong>
        <ValueLine value={values.patientName} />
      </div>
      <div className="patient-row">
        <LabelValue label="SEX" value={values.sex} />
        <LabelValue label="AGE" value={values.age} />
        <LabelValue label="LAB NO" value={values.labNo} />
        <LabelValue label="DATE" value={values.date} />
      </div>
    </section>
  )
}

function LineList({ rows, values, compact = false, tight = false }) {
  return (
    <div className={tight ? 'line-list tight-lines' : compact ? 'line-list compact-lines' : 'line-list'}>
      {rows.map(([label, key, unit]) => (
        <div className="line-row" key={key}>
          <span className="line-label">{label}</span>
          <ValueLine value={values[key]} />
          {unit && <span className="line-unit">{unit}</span>}
        </div>
      ))}
    </div>
  )
}

function LabelValue({ label, value }) {
  return (
    <div className="label-value">
      <strong>{label}:</strong>
      <ValueLine value={value} />
    </div>
  )
}

function ValueLine({ value, wide = false }) {
  return <span className={wide ? 'value-line wide-value' : 'value-line'}>{value}</span>
}

function ValueBlock({ value }) {
  return <div className="value-block">{value}</div>
}

function Signature({ value }) {
  return (
    <footer className="signature">
      <ValueLine value={value} />
      <strong>Medical lab scientist i/c</strong>
    </footer>
  )
}

async function createPdf(element) {
  if (!element) throw new Error('Document preview is not ready')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const exportRoot = document.createElement('div')
  exportRoot.className = 'pdf-export-root'
  exportRoot.append(element.cloneNode(true))
  document.body.append(exportRoot)

  try {
    const pages = [...exportRoot.querySelectorAll('.page')]

    for (const [index, page] of pages.entries()) {
      if (index > 0) pdf.addPage('a4', 'portrait')

      const canvas = await html2canvas(page, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        windowWidth: 794,
        windowHeight: 1123,
      })
      const image = canvas.toDataURL('image/jpeg', 0.96)
      pdf.addImage(image, 'JPEG', 0, 0, 210, 297)
    }
  } finally {
    exportRoot.remove()
  }

  return pdf.output('blob')
}

async function savePdfBlob(blob, templateFolder, filename) {
  if ('showDirectoryPicker' in window) {
    const root = await window.showDirectoryPicker({ id: 'result-lab-folder', mode: 'readwrite' })
    const resultFolder = await root.getDirectoryHandle('Result_Lab', { create: true })
    const templateHandle = await resultFolder.getDirectoryHandle(templateFolder, { create: true })
    const fileHandle = await templateHandle.getFileHandle(filename, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()
    return `Saved to Result_Lab/${templateFolder}/${filename}`
  }

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${templateFolder} - ${filename}`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(link.href)
  return `Downloaded as ${templateFolder} - ${filename}`
}

function safeName(value) {
  return value.trim().replace(/[<>:"/\\|?*]+/g, '').replace(/\s+/g, ' ') || 'Unnamed Patient'
}

function toLabel(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase())
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default App
