import io from "socket.io-client";

export let socket = null;

export const connectSocket = (params) => {
  if(!socket) {
    socket = io("http://localhost:3001", { auth: {...params} });
  }
}

export const disconnect = () => {
  if(socket) {
    socket.disconnect(true);
    socket = null;
  }
}

export const joinWork = (params) => {
  if (socket) {
    return socket.emit("join_work", {...params});
  }
};

export const disconnectOfWork = () => {
  if (socket) {
    socket.emit("disconnect_work", {
      id: "2131231",
    });
    socket.disconnect(true);
    socket = null;
  }
};

export const outPerimeter = (message) => {
  if (socket) {
    socket.emit("out_perimeter", {
      message,
    });
  }
};

export const sendMessage = (message) => {
  if (socket) {
    socket.emit("message", {
      message,
    });
  }
};

export const joinRoom = (params) => {
  if(socket) {
    socket.emit('join_room', params)
  }
}
