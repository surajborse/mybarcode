import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import './Scanner.css'

export default function Scanner() {
  const [scans, setScans] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Starting camera…')
  const lastRef = useRef({ code: '', at: 0 })

  useEffect(() => {
    let cancelled = false
    let scanner

    async function start() {
      try {
        scanner = new Html5Qrcode('barcode-reader')
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 280, height: 120 },
            aspectRatio: 1.777,
            formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39],
          },
          (decodedText) => {
            const now = Date.now()
            if (
              decodedText === lastRef.current.code &&
              now - lastRef.current.at < 2500
            ) {
              return
            }
            lastRef.current = { code: decodedText, at: now }
            setScans((prev) => [
              {
                id: `${now}-${decodedText}`,
                code: decodedText,
                time: new Date().toLocaleTimeString(),
              },
              ...prev,
            ])
          },
          () => {},
        )
        if (!cancelled) setStatus('Point camera at a Code 39 barcode')
      } catch (err) {
        if (!cancelled) {
          setStatus('')
          setError(err?.message || 'Camera permission denied or unavailable')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      if (scanner?.isScanning) {
        scanner.stop().then(() => scanner.clear()).catch(() => {})
      }
    }
  }, [])

  return (
    <div className="scanner-page">
      <header className="scanner-header">
        <h1>Code 39 Scanner</h1>
        <p>{status || error}</p>
      </header>

      <div id="barcode-reader" className="scanner-view" />

      {error ? <p className="scanner-error">{error}</p> : null}

      <section className="scan-list">
        <div className="scan-list-head">
          <h2>Scanned ({scans.length})</h2>
          {scans.length ? (
            <button type="button" onClick={() => setScans([])}>
              Clear
            </button>
          ) : null}
        </div>
        {scans.length === 0 ? (
          <p className="scan-empty">No barcodes yet</p>
        ) : (
          <ul>
            {scans.map((item) => (
              <li key={item.id}>
                <strong>{item.code}</strong>
                <span>{item.time}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
