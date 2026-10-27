// Tour 360° do Residencial Pardinho (usa Pannellum, hospedado no próprio site)
(function(){
  var SCENES = window.PDH_TOUR || [];
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}

  function config(base, first){
    var scenes = {};
    SCENES.forEach(function(s){
      scenes[s.id] = {
        title: s.title,
        type: "equirectangular",
        panorama: base + s.id + ".jpg",
        yaw: s.yaw || 0, pitch: s.pitch || 0, hfov: 105,
        hotSpots: (s.links || []).map(function(l){
          return { pitch: l.pitch, yaw: l.yaw, type: "scene", text: l.text, sceneId: l.to };
        })
      };
    });
    return {
      "default": {
        firstScene: first, autoLoad: true, sceneFadeDuration: reduce ? 0 : 700,
        mouseZoom: false, showZoomCtrl: true, showFullscreenCtrl: true, compass: false,
        autoRotate: reduce ? 0 : -2, autoRotateInactivityDelay: 15000,
        strings: {
          loadButtonLabel: "Carregar o tour", loadingLabel: "Carregando...",
          bylineLabel: "", noPanoramaError: "Imagem não encontrada.",
          fileAccessError: "Não foi possível abrir a imagem %s.",
          malformedURLError: "Endereço da imagem inválido.",
          iOS8WebGLError: "Este navegador não consegue mostrar o tour. Tente atualizar o sistema.",
          genericWebGLError: "Este navegador não consegue mostrar o tour 360°.",
          textureSizeError: "A imagem é grande demais para este aparelho.",
          unknownError: "Não foi possível carregar o tour."
        }
      },
      scenes: scenes
    };
  }

  document.querySelectorAll("[data-tour]").forEach(function(box){
    var stage = box.querySelector(".pano-stage");
    var start = box.querySelector(".pano-start");
    var label = box.querySelector(".pano-now");
    var chips = box.querySelectorAll("[data-scene]");
    var base = box.getAttribute("data-base") || "/img/tour/";
    var viewer = null;

    function mark(id){
      chips.forEach(function(c){ c.setAttribute("aria-pressed", c.getAttribute("data-scene") === id ? "true" : "false"); });
      var s = SCENES.filter(function(x){ return x.id === id; })[0];
      if(label && s) label.textContent = s.title;
    }
    function go(id){
      if(typeof pannellum === "undefined"){ if(label) label.textContent = "Não foi possível carregar o tour."; return; }
      if(!viewer){
        if(start) start.hidden = true;
        viewer = pannellum.viewer(stage, config(base, id));
        viewer.on("scenechange", mark);
        box.pdhViewer = viewer;
      } else if(viewer.getScene() !== id){
        viewer.loadScene(id);
      }
      mark(id);
    }
    if(start) start.addEventListener("click", function(){ go(SCENES[0].id); });
    chips.forEach(function(c){ c.addEventListener("click", function(){ go(c.getAttribute("data-scene")); }); });
    var next = box.querySelector(".pano-next");
    if(next) next.addEventListener("click", function(){
      var cur = viewer ? viewer.getScene() : null;
      var i = 0; SCENES.forEach(function(s, k){ if(s.id === cur) i = k + 1; });
      go(SCENES[i % SCENES.length].id);
    });
  });
})();
