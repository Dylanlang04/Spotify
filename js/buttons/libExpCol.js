var track = 1

function expandCol() {
    if (track === 1) {
        lib.classList.add("expand")
        pl.classList.add("expand")
        liked.classList.add("expand")
        create_pl.classList.add("expand")
        library_cont.classList.add("expand")
        expand_lib.classList.add("expand")
        fullscreen.classList.add("expand")
        wrap.classList.add("expand")
        expand.classList.add("expand")
        expand.classList.remove("hidden")
        your_lib.classList.remove("hidden")
        pl_filters.classList.remove("hidden")
        search_filt.classList.remove("hidden")
        track = 0
    } else {
        lib.classList.remove("expand")
        pl.classList.remove("expand")
        liked.classList.remove("expand")
        create_pl.classList.remove("expand")
        library_cont.classList.remove("expand")
        fullscreen.classList.remove("expand")
        wrap.classList.remove("expand")
        expand.classList.remove("expand")
        expand.classList.add("hidden")
        your_lib.classList.add("hidden")
        pl_filters.classList.add("hidden")
        search_filt.classList.add("hidden")
        
        track = 1
    }

}
