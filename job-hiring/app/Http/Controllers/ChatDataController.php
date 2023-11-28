<?php

namespace App\Http\Controllers;

use App\Models\ChatData;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class ChatDataController extends Controller
{
    // 1 belum dbaca admin
    // 2 belum dibaca user
    // 3 sudah di baca 

    // 1 flag sender user
    // 2 flag sender admin

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            try {
                $validateData = $request->validate([
                    'message' => 'required',
                    'type' => 'required',
                ]);

                if ($request->type == 'file') {
                    $lastMessage = 'File';
                } else {
                    $lastMessage = $request->message;
                }
                $chat = Chat::where('talentId', $user->id)->first();
                if (!$chat) {
                    $admin =  User::where('role', 'admin')->first();
                    $data = [
                        'talentId' => $user->id,
                        'adminId' => $admin->id,
                        'flag' => '1',
                        'flagSender' => '1'
                    ];
                    $chat = new Chat($data);
                    $chat->lastMessage =  $lastMessage;
                    $chat->save();
                } else {
                    $chat->flag = '1';
                    $chat->flagSender = '1';
                    $chat->lastMessage =  $lastMessage;
                    $chat->save();
                }
                $chatData = new ChatData($validateData);
                $chatData->senderId = $user->id;
                $chatData->chatId = $chat->id;
                $chatData->status = 'sent';
                if ($request->type == 'file') {
                    $file = $request->file('message');
                    $fileName = time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                    $file->storeAs('public/chatFiles', $fileName);
                    $chatData->message = $fileName;
                }
                $chatData->save();
                $chatData = ChatData::where('chatId', $chat->id)->with('sender:id,role,firstName,lastName,avatar')->get();
                return response()->json(["chatData" => $chatData], 201);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function getChatDataUserLogin()
    {
        $user = Auth::user();
        if ($user) {
            try {
                $chat = Chat::where('talentId', $user->id)->first();
                if (!$chat) {
                    return response()->json([], 204);
                }
                $chatData = ChatData::where('chatId', $chat->id)->where('status', 'sent')->whereNot('senderId', $user->id)
                    ->update(['status' => 'readed']);
                $chatData = ChatData::where('chatId', $chat->id)->with('sender:id,role,firstName,lastName,avatar')->get();
                if ($chat->flagSender != '1') {
                    $chat->flag = '3';
                }
                $chat->save();
                return response()->json(["chatData" => $chatData], 200);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }


    public function getIsNewChatPresent()
    {

        $user = Auth::user();
        if ($user) {
            try {
                if ($user->role == 'talent') {
                    $chat = Chat::where('talentId', $user->id)->where('flag', '2')->first();
                    if ($chat) {
                        return response()->json(["newChat" => 'present'], 200);
                    } else {
                        return response()->json([], 204);
                    }
                } else {
                    $chat = Chat::where('flag', '1')->first();
                    if ($chat) {
                        return response()->json(["newChat" => 'present'], 200);
                    } else {
                        return response()->json([], 204);
                    }
                }
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function getChatListAmin()
    {
        $user = Auth::user();
        if ($user && $user->role == 'admin') {
            try {
                $chats = Chat::with('talent:id,firstName,lastName,avatar,status')->orderByDesc('updated_at')->get();
                return response()->json(["chatList" => $chats], 200);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function getChatDataAdmin($idChat)
    {
        $user = Auth::user();
        if ($user && $user->role == 'admin') {
            try {
                $chat = Chat::where('id', $idChat)->first();
                $chatData = ChatData::where('chatId', $idChat)->where('status', 'sent')->whereNot('senderId', $user->id)
                    ->update(['status' => 'readed']);
                $chatData = ChatData::where('chatId', $idChat)->with('sender:id,role')->get();
                if ($chat->flagSender != '2') {
                    $chat->flag = '3';
                }
                if ($chat->flagSender != '2') {
                    $chat->flag = '3';
                }
                $chat->save();
                return response()->json(["chatData" => $chatData], 200);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function sendChatByAdmin(Request $request, $idTalent)
    {
        $user = Auth::user();
        if ($user && $user->role == 'admin') {
            try {
                $validateData = $request->validate([
                    'message' => 'required',
                    'type' => 'required',
                ]);

                if ($request->type == 'file') {
                    $lastMessage = 'File';
                } else {
                    $lastMessage = $request->message;
                }
                // bedakan cara penyimpanan file
                $chat = Chat::where('talentId', $idTalent)->first();
                if (!$chat) {
                    $data = [
                        'talentId' => $idTalent,
                        'adminId' => $user->id,
                        'flag' => '2',
                        'flagSender' => '2'
                    ];
                    $chat = new Chat($data);
                    $chat->lastMessage = $lastMessage;
                    $chat->save();
                } else {
                    $chat->flag = '2';
                    $chat->flagSender = '2';
                    $chat->lastMessage = $lastMessage;
                    $chat->save();
                }
                $chatData = new ChatData($validateData);
                $chatData->senderId = $user->id;
                $chatData->chatId = $chat->id;
                $chatData->status = 'sent';

                if ($request->type == 'file') {
                    $file = $request->file('message');
                    $fileName = time() . '-' .  str_replace(' ', '_', $file->getClientOriginalName());
                    $file->storeAs('public/chatFiles', $fileName);
                    $chatData->message = $fileName;
                }
                $chatData->save();
                $chatData = ChatData::where('chatId', $chat->id)->with('sender:id,role,avatar')->get();
                $chatReturn = Chat::with('talent:id,firstName,lastName,status')->where('id', $chat->id)->first();
                return response()->json(["chatData" => $chatData, "chat" => $chatReturn], 201);
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function getChatDataFile($fileName)
    {
        $path = storage_path('app/public/chatFiles/' . $fileName);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = response($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }
}
