export default function adminPermission(permission: string): boolean {
    if (permission !== 'admin') {
        return false;
    }
    return true;
}