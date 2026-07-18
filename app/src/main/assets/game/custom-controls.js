/* Custom touch control overlay for the Construct 2 "Super Mario Bros" export.
 * Adds: bottom drag zone for Left/Right movement, and A/B buttons bottom-right.
 * Works by dispatching synthetic keydown/keyup events through jQuery, the same
 * way the game's own keyboard handler listens (jQuery(document).keydown/keyup),
 * so this never touches the compiled game logic (data.js / c2runtime.js).
 *
 * Key mapping used by this game (confirmed from its keyboard bindings):
 *   37 = Left, 39 = Right, 38 = Up, 40 = Down
 *   32 = Space  -> Jump (A button)
 *   16 = Shift  -> Run / Fireball (B button)
 */
(function () {
    "use strict";

    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_A = 32;   // Jump
    var KEY_B = 16;   // Run / Fire

    function sendKey(type, which) {
        if (!window.jQuery) return;
        var evt = jQuery.Event(type);
        evt.which = which;
        evt.keyCode = which;
        jQuery(document).trigger(evt);
    }

    function keyDown(which) { sendKey("keydown", which); }
    function keyUp(which) { sendKey("keyup", which); }

    function buildOverlay() {
        var root = document.createElement("div");
        root.id = "custom-controls";

        var moveZone = document.createElement("div");
        moveZone.id = "move-zone";
        root.appendChild(moveZone);

        var actionWrap = document.createElement("div");
        actionWrap.id = "action-buttons";

        var btnB = document.createElement("div");
        btnB.id = "btn-b";
        btnB.className = "action-btn";
        btnB.textContent = "B";

        var btnA = document.createElement("div");
        btnA.id = "btn-a";
        btnA.className = "action-btn";
        btnA.textContent = "A";

        actionWrap.appendChild(btnB);
        actionWrap.appendChild(btnA);
        root.appendChild(actionWrap);

        document.body.appendChild(root);

        setupMoveZone(moveZone);
        setupActionButton(btnA, KEY_A);
        setupActionButton(btnB, KEY_B);
    }

    // --- Left/Right drag zone ---
    function setupMoveZone(zone) {
        var activePointerId = null;
        var currentDir = null; // KEY_LEFT or KEY_RIGHT

        function dirForX(clientX) {
            var rect = zone.getBoundingClientRect();
            var relX = clientX - rect.left;
            return (relX < rect.width / 2) ? KEY_LEFT : KEY_RIGHT;
        }

        function start(e) {
            e.preventDefault();
            if (activePointerId !== null) return;
            activePointerId = e.pointerId;
            currentDir = dirForX(e.clientX);
            keyDown(currentDir);
            zone.setPointerCapture && zone.setPointerCapture(e.pointerId);
        }

        function move(e) {
            if (e.pointerId !== activePointerId) return;
            e.preventDefault();
            var newDir = dirForX(e.clientX);
            if (newDir !== currentDir) {
                keyUp(currentDir);
                currentDir = newDir;
                keyDown(currentDir);
            }
        }

        function end(e) {
            if (e.pointerId !== activePointerId) return;
            e.preventDefault();
            keyUp(currentDir);
            activePointerId = null;
            currentDir = null;
        }

        zone.addEventListener("pointerdown", start);
        zone.addEventListener("pointermove", move);
        zone.addEventListener("pointerup", end);
        zone.addEventListener("pointercancel", end);
        zone.addEventListener("pointerleave", end);
    }

    // --- A / B buttons ---
    function setupActionButton(btn, keyCode) {
        var activePointerId = null;

        function start(e) {
            e.preventDefault();
            if (activePointerId !== null) return;
            activePointerId = e.pointerId;
            btn.classList.add("pressed");
            keyDown(keyCode);
            btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
        }

        function end(e) {
            if (e.pointerId !== activePointerId) return;
            e.preventDefault();
            btn.classList.remove("pressed");
            keyUp(keyCode);
            activePointerId = null;
        }

        btn.addEventListener("pointerdown", start);
        btn.addEventListener("pointerup", end);
        btn.addEventListener("pointercancel", end);
        btn.addEventListener("pointerleave", end);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildOverlay);
    } else {
        buildOverlay();
    }
})();
