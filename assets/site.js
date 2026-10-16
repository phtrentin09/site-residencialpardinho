(function(){
  var WA = "5541997458158";
  function store(k, v){ try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } }

  // menu
  var btn = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if(btn && nav){
    btn.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function(e){ if(e.target.closest("a")){ nav.classList.remove("open"); btn.setAttribute("aria-expanded","false"); } });
  }

  // cookies
  var ck = document.querySelector(".cookies");
  function closeCookies(){ if(!ck) return; ck.hidden = true; ck.style.display = "none"; if(ck.parentNode) ck.parentNode.removeChild(ck); ck = null; }
  if(ck){
    if(store("pdh-cookies")){ closeCookies(); }
    else {
      ck.hidden = false;
      ck.addEventListener("click", function(e){
        var b = e.target.closest("[data-ck]"); if(!b) return;
        var choice = b.getAttribute("data-ck");
        store("pdh-cookies", choice); closeCookies();
        if(choice === "all") loadMaps();
      });
    }
  }

  // mapa só com consentimento
  function loadMaps(){
    document.querySelectorAll(".map[data-src]").forEach(function(m){
      if(m.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = m.getAttribute("data-src"); f.loading = "lazy"; f.title = "Mapa do Residencial Pardinho";
      f.referrerPolicy = "no-referrer-when-downgrade";
      m.appendChild(f);
    });
  }
  if(store("pdh-cookies")==="all") loadMaps();
  document.addEventListener("click", function(e){
    if(e.target.closest("[data-load-map]")){ e.preventDefault(); store("pdh-cookies","all"); closeCookies(); loadMaps(); }
  });

  // formulário que monta a mensagem do WhatsApp
  document.querySelectorAll("form.wa").forEach(function(f){
    f.addEventListener("submit", function(e){
      e.preventDefault();
      var d = new FormData(f), parts = ["Olá! Vim pelo site do Residencial Pardinho."];
      if(f.classList.contains("vaga")){
        parts = ["Olá! Vim pela página Trabalhe conosco do site do Residencial Pardinho."];
        if(d.get("nome")) parts.push("Meu nome é " + d.get("nome") + ".");
        if(d.get("area")) parts.push("Área: " + d.get("area") + ".");
        if(d.get("exp")) parts.push("Experiência: " + d.get("exp") + ".");
        if(d.get("bairro")) parts.push("Moro em " + d.get("bairro") + ".");
        if(d.get("turno")) parts.push("Disponibilidade: " + d.get("turno") + ".");
        if(d.get("msg")) parts.push(d.get("msg"));
        parts.push("Vou enviar meu currículo em seguida.");
        var u = "https://wa.me/" + WA + "?text=" + encodeURIComponent(parts.join(" "));
        var l = document.createElement("a"); l.href = u; l.target = "_blank"; l.rel = "noopener";
        document.body.appendChild(l); l.click(); l.remove();
        return;
      }
      if(d.get("nome")) parts.push("Meu nome é " + d.get("nome") + ".");
      if(d.get("para")) parts.push("Procuro uma vaga para " + d.get("para") + ".");
      if(d.get("idade")) parts.push("Idade: " + d.get("idade") + ".");
      if(d.get("aut")) parts.push("Autonomia: " + d.get("aut") + ".");
      if(d.get("est")) parts.push("Estadia: " + d.get("est") + ".");
      if(d.get("msg")) parts.push(d.get("msg"));
      if(f.hasAttribute("data-visita")) parts.push("Gostaria de agendar uma visita.");
      var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(parts.join(" "));
      var a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
    });
  });
})();
