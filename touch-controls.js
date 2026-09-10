// 觸控虛擬搖桿與鍵盤滑鼠雙模控制器 (TouchControls)
// 完美適配 iPad、Android 平板與電腦桌面

class TouchControls {
  constructor() {
    this.moveVector = { forward: 0, right: 0 };
    this.lookDelta = { yaw: 0, pitch: 0 };
    this.interactRequested = false;

    // 鍵盤狀態
    this.keys = {
      KeyW: false, KeyS: false, KeyA: false, KeyD: false,
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
      KeyE: false, Space: false
    };

    // 觸控狀態
    this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    this.joystickTouchId = null;
    this.lookTouchId = null;
    this.joystickOrigin = { x: 0, y: 0 };
    this.joystickCurrent = { x: 0, y: 0 };
    this.joystickRadius = 50;
    this.lastLookPos = { x: 0, y: 0 };

    // 滑鼠狀態
    this.isMouseDown = false;
    this.isPointerLocked = false;
    this.lastMousePos = { x: 0, y: 0 };

    this.initKeyboard();
    this.initMouse();
    this.initTouch();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = true;
      }
      if (e.code === 'KeyE') {
        this.interactRequested = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = false;
      }
    });
  }

  initMouse() {
    const canvas = document.getElementById('renderCanvas');

    window.addEventListener('mousedown', (e) => {
      // 點擊UI元素時不觸發旋轉視角
      if (e.target.closest('#uiLayer') || e.target.closest('#speechModal') || e.target.closest('.touch-button')) return;
      this.isMouseDown = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === canvas) {
        this.lookDelta.yaw -= e.movementX * 0.0025;
        this.lookDelta.pitch -= e.movementY * 0.0025;
      } else if (this.isMouseDown) {
        const dx = e.clientX - this.lastMousePos.x;
        const dy = e.clientY - this.lastMousePos.y;
        this.lookDelta.yaw -= dx * 0.003;
        this.lookDelta.pitch -= dy * 0.003;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
      }
    });
  }

  initTouch() {
    const joystickBase = document.getElementById('joystickBase');
    const joystickKnob = document.getElementById('joystickKnob');
    const touchLookArea = document.getElementById('touchLookArea');
    const actionBtn = document.getElementById('touchActionBtn');

    if (actionBtn) {
      actionBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.interactRequested = true;
        if (window.audioManager) window.audioManager.playSfx('click');
      }, { passive: false });

      actionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.interactRequested = true;
      });
    }

    // 左半螢幕虛擬搖桿
    const leftZone = document.getElementById('touchLeftZone') || window;
    leftZone.addEventListener('touchstart', (e) => {
      for (let touch of e.changedTouches) {
        if (touch.clientX < window.innerWidth * 0.45 && this.joystickTouchId === null) {
          this.joystickTouchId = touch.identifier;
          this.joystickOrigin = { x: touch.clientX, y: touch.clientY };
          this.joystickCurrent = { x: touch.clientX, y: touch.clientY };

          if (joystickBase && joystickKnob) {
            joystickBase.style.display = 'block';
            joystickBase.style.left = `${touch.clientX - 50}px`;
            joystickBase.style.top = `${touch.clientY - 50}px`;
            joystickKnob.style.transform = 'translate(0px, 0px)';
          }
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      for (let touch of e.changedTouches) {
        if (touch.identifier === this.joystickTouchId) {
          const dx = touch.clientX - this.joystickOrigin.x;
          const dy = touch.clientY - this.joystickOrigin.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = this.joystickRadius;

          const clampedDist = Math.min(dist, maxDist);
          const angle = Math.atan2(dy, dx);

          const knobX = Math.cos(angle) * clampedDist;
          const knobY = Math.sin(angle) * clampedDist;

          if (joystickKnob) {
            joystickKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
          }

          // 搖桿向量：X控制左右平移，Y控制前後
          this.joystickCurrent = {
            x: knobX / maxDist,
            y: knobY / maxDist
          };
        } else if (touch.identifier === this.lookTouchId) {
          const dx = touch.clientX - this.lastLookPos.x;
          const dy = touch.clientY - this.lastLookPos.y;

          this.lookDelta.yaw -= dx * 0.004;
          this.lookDelta.pitch -= dy * 0.004;

          this.lastLookPos = { x: touch.clientX, y: touch.clientY };
        }
      }
    }, { passive: true });

    const handleTouchEnd = (e) => {
      for (let touch of e.changedTouches) {
        if (touch.identifier === this.joystickTouchId) {
          this.joystickTouchId = null;
          this.joystickCurrent = { x: 0, y: 0 };
          if (joystickBase) joystickBase.style.display = 'none';
        } else if (touch.identifier === this.lookTouchId) {
          this.lookTouchId = null;
        }
      }
    };

    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // 右半螢幕滑動旋轉視角
    if (touchLookArea) {
      touchLookArea.addEventListener('touchstart', (e) => {
        for (let touch of e.changedTouches) {
          if (this.lookTouchId === null) {
            this.lookTouchId = touch.identifier;
            this.lastLookPos = { x: touch.clientX, y: touch.clientY };
          }
        }
      }, { passive: true });
    }
  }

  update() {
    let f = 0;
    let r = 0;

    // 鍵盤輸入
    if (this.keys.KeyW || this.keys.ArrowUp) f += 1;
    if (this.keys.KeyS || this.keys.ArrowDown) f -= 1;
    if (this.keys.KeyD || this.keys.ArrowRight) r += 1;
    if (this.keys.KeyA || this.keys.ArrowLeft) r -= 1;

    // 搖桿輸入疊加
    if (this.joystickTouchId !== null) {
      f -= this.joystickCurrent.y; // 向上拉為向前移動
      r += this.joystickCurrent.x;
    }

    // 正規化平移向量，避免斜走速度過快
    const len = Math.sqrt(f * f + r * r);
    if (len > 1.0) {
      f /= len;
      r /= len;
    }

    this.moveVector.forward = f;
    this.moveVector.right = r;
  }

  getLookDelta() {
    const delta = { ...this.lookDelta };
    this.lookDelta.yaw = 0;
    this.lookDelta.pitch = 0;
    return delta;
  }

  consumeInteract() {
    const wasPressed = this.interactRequested;
    this.interactRequested = false;
    return wasPressed;
  }
}

window.touchControls = new TouchControls();
