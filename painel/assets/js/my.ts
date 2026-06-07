hasPermission(permissions: string[]): boolean {
	for(const permission of permissions){
		if(!this.currentUser.value || !this.currentUser.value.permissions.includes(permission)){
			return false;
		}
	}
	return true;
}