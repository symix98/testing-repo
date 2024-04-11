import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileFmsComponent } from 'src/app/pages/shared/user-profile/user-profile-fms/user-profile-fms.component';

const routes: Routes = [
    { path: '', component: UserProfileFmsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class profileRoutingModule {}
