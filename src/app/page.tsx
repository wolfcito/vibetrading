"use client"

import { useState, useEffect, useCallback } from "react"
import Split from "react-split"
import { Terminal, TrendingUp, Grid2X2, Smartphone, Fullscreen, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// URLs actualizadas de Mode Network
const DEFAULT_URLS = {
  terminal: "https://app.mode.network/terminal/",
  trading: "https://trade.mode.network/perp/PERP_ETH_USDC",
}

// Tamaños por defecto de los paneles (50% cada uno)
const DEFAULT_SIZES = [50, 50]
const STORAGE_KEY = "mode-layout-sizes"

export default function ModeLayout() {
  // Estados principales
  const [sizes, setSizes] = useState<number[]>(DEFAULT_SIZES)
  const [viewMode, setViewMode] = useState<"both" | "terminal" | "trading">("both")
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"terminal" | "trading">("terminal")
  const [isFullscreen, setIsFullscreen] = useState<"left" | "right" | null>(null)

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Cargar tamaños guardados del localStorage
  useEffect(() => {
    const savedSizes = localStorage.getItem(STORAGE_KEY)
    if (savedSizes) {
      try {
        const parsedSizes = JSON.parse(savedSizes)
        if (Array.isArray(parsedSizes) && parsedSizes.length === 2) {
          setSizes(parsedSizes)
        }
      } catch (error) {
        console.warn("Error loading saved panel sizes:", error)
      }
    }
  }, [])

  // Guardar tamaños en localStorage
  const saveSizes = useCallback((newSizes: number[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSizes))
  }, [])

  // Manejar cambio de tamaños
  const handleSizeChange = useCallback(
    (newSizes: number[]) => {
      setSizes(newSizes)
      saveSizes(newSizes)
    },
    [saveSizes],
  )

  // Cambiar modo de vista
  const setView = useCallback(
    (mode: "both" | "terminal" | "trading") => {
      setViewMode(mode)
      if (mode === "both") {
        setSizes(DEFAULT_SIZES)
        saveSizes(DEFAULT_SIZES)
      }
    },
    [saveSizes],
  )

  // Pantalla completa para iframes
  const toggleFullscreen = useCallback(
    (panel: "left" | "right") => {
      if (isFullscreen === panel) {
        setIsFullscreen(null)
      } else {
        setIsFullscreen(panel)
      }
    },
    [isFullscreen],
  )

  // Componente de iframe sin bordes ni espaciados
  const IframePanel = ({
    url,
    title,
    panel,
  }: {
    url: string
    title: string
    panel: "left" | "right"
  }) => (
    <div className="relative h-full w-full bg-black">
      <div className="absolute top-2 right-2 z-10">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toggleFullscreen(panel)}
          aria-label={`Pantalla completa ${title}`}
          className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70 border-0"
        >
          <Fullscreen className="h-3 w-3 text-white" />
        </Button>
      </div>
      <iframe
        src={url}
        title={title}
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  )

  // Vista móvil con pestañas
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-black">
        {/* Barra superior móvil */}
        <div className="bg-black border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-yellow-400" />
            <h1 className="font-semibold text-white">MODE</h1>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={activeTab === "terminal" ? "default" : "outline"}
              onClick={() => setActiveTab("terminal")}
              className="text-xs bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Terminal
            </Button>
            <Button
              size="sm"
              variant={activeTab === "trading" ? "default" : "outline"}
              onClick={() => setActiveTab("trading")}
              className="text-xs bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Trading
            </Button>
          </div>
        </div>

        {/* Contenido móvil sin padding */}
        <div className="flex-1">
          {activeTab === "terminal" ? (
            <IframePanel url={DEFAULT_URLS.terminal} title="Mode Terminal AI" panel="left" />
          ) : (
            <IframePanel url={DEFAULT_URLS.trading} title="Mode Trading" panel="right" />
          )}
        </div>
      </div>
    )
  }

  // Modal de pantalla completa
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            onClick={() => setIsFullscreen(null)}
            aria-label="Cerrar pantalla completa"
            className="bg-black/50 hover:bg-black/70 border-0"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
        <IframePanel
          url={isFullscreen === "left" ? DEFAULT_URLS.terminal : DEFAULT_URLS.trading}
          title={isFullscreen === "left" ? "Mode Terminal AI" : "Mode Trading"}
          panel={isFullscreen}
        />
      </div>
    )
  }

  // Vista de escritorio
  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Barra de controles superior - estilo Mode Network */}
      <div className="bg-black border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="text-yellow-400 font-bold text-xl">MODE</div>
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant={viewMode === "terminal" ? "default" : "ghost"}
              onClick={() => setView("terminal")}
              className={`${
                viewMode === "terminal"
                  ? "bg-yellow-400 text-black hover:bg-yellow-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Terminal className="h-4 w-4 mr-2" />
              AI TERMINAL
            </Button>

            <Button
              size="sm"
              variant={viewMode === "trading" ? "default" : "ghost"}
              onClick={() => setView("trading")}
              className={`${
                viewMode === "trading"
                  ? "bg-yellow-400 text-black hover:bg-yellow-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              TRADE
            </Button>

            <Button
              size="sm"
              variant={viewMode === "both" ? "default" : "ghost"}
              onClick={() => setView("both")}
              className={`${
                viewMode === "both"
                  ? "bg-yellow-400 text-black hover:bg-yellow-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Grid2X2 className="h-4 w-4 mr-2" />
              BOTH
            </Button>
          </div>
        </div>
      </div>

      {/* Área principal sin padding ni bordes */}
      <div className="flex-1">
        {viewMode === "both" ? (
          // Vista dividida con ambos paneles
          <Split
            sizes={sizes}
            minSize={200}
            gutterSize={4}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
            onDragEnd={handleSizeChange}
            className="flex h-full"
            resizerStyle={{
              background: "#374151",
              cursor: "col-resize",
            }}
          >
            <IframePanel url={DEFAULT_URLS.terminal} title="Mode Terminal AI" panel="left" />
            <IframePanel url={DEFAULT_URLS.trading} title="Mode Trading" panel="right" />
          </Split>
        ) : (
          // Vista de panel único
          <div className="h-full">
            {viewMode === "terminal" && (
              <IframePanel url={DEFAULT_URLS.terminal} title="Mode Terminal AI" panel="left" />
            )}
            {viewMode === "trading" && <IframePanel url={DEFAULT_URLS.trading} title="Mode Trading" panel="right" />}
          </div>
        )}
      </div>
    </div>
  )
}
