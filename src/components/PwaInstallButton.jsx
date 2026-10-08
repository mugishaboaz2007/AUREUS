import { useEffect, useRef, useState } from 'react';

function isIosDevice() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    setInstalled(isInstalled());

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (showInstructions && dialog && !dialog.open) dialog.showModal();
    if (!showInstructions && dialog?.open) dialog.close();
  }, [showInstructions]);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setInstallPrompt(null);
      return;
    }
    setShowInstructions(true);
  };

  if (installed) return null;

  const ios = isIosDevice();

  return (
    <>
      <button className="add-button pwa-install-button" onClick={handleInstall}>
        <b>Install App</b>
      </button>
      <dialog
        className="pwa-install-dialog"
        ref={dialogRef}
        aria-labelledby="pwa-install-title"
        onCancel={() => setShowInstructions(false)}
        onClose={() => setShowInstructions(false)}
      >
        <button
          className="pwa-install-dialog__close"
          type="button"
          onClick={() => setShowInstructions(false)}
          aria-label="Close installation instructions"
        >
          ×
        </button>
        <p className="section-kicker">AUREUS installation</p>
        <h2 id="pwa-install-title">{ios ? 'Add AUREUS to your Home Screen' : 'Install AUREUS'}</h2>
        {ios ? (
          <ol>
            <li>Open this website in Safari.</li>
            <li>Tap the Share button.</li>
            <li>Choose <strong>Add to Home Screen</strong>, then tap Add.</li>
          </ol>
        ) : (
          <p>
            Use your browser&apos;s menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
            If this option is not available yet, make sure you are visiting this site over HTTPS and try again later.
          </p>
        )}
        <button className="btn btn--primary" type="button" onClick={() => setShowInstructions(false)}>
          Done
        </button>
      </dialog>
    </>
  );
}
